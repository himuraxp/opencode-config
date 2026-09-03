#!/usr/bin/env node
/**
 * Figma Design System Sync CLI
 * 
 * Commands:
 *   check   - Check if sync is needed
 *   sync    - Perform full sync
 *   diff    - Show diff between snapshots
 */

import { execSync } from 'node:child_process';
import { loadConfig, Config } from './config.js';
import { FigmaClient, FigmaQuotaError } from './figma-client.js';
import { captureAll, CaptureResult } from './capture.js';
import { normalizeCapture, computeDiff, generateChangelogEntry, DiffResult } from './normalize.js';
import { generateMapping } from './mapping.js';
import {
  createSnapshotWriter,
  initSnapshotsRepo,
  writeSnapshot,
  loadExistingSnapshot,
  updateChangelog,
  commitSnapshot
} from './snapshots.js';

const args = process.argv.slice(2);
const command = args[0];
const fileKeyArg = args.find(a => a.startsWith('--file='))?.split('=')[1];
const dryRun = args.includes('--dry-run');

if (!command || !['check', 'sync', 'diff', 'mapping'].includes(command)) {
  console.error('Usage: figma-ds-sync <command> [--file=<key>] [--dry-run]');
  console.error('Commands: check, sync, diff, mapping');
  process.exit(1);
}

async function main() {
  let config: Config;
  try {
    config = loadConfig();
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }

  const fileKey = fileKeyArg || config.fileKey;
  const client = new FigmaClient(config.figmaToken);
  const writer = createSnapshotWriter(config.snapshotsDir);

  switch (command) {
    case 'check':
      await checkCommand(client, fileKey, config.snapshotsDir);
      break;
    case 'sync':
      await syncCommand(client, fileKey, writer, config.snapshotsDir);
      break;
    case 'diff':
      await diffCommand(client, fileKey, config.snapshotsDir);
      break;
    case 'mapping':
      // Local-only operation: snapshot data + ik reference, never hits the Figma API
      generateMapping(config.snapshotsDir, dryRun);
      break;
  }
}

async function checkCommand(client: FigmaClient, fileKey: string, snapshotsDir: string): Promise<void> {
  console.log(`Checking sync status for file ${fileKey}...`);

  try {
    // /versions is lightweight and never gated by Figma's plan quota
    // (unlike /files/{key} which can 429 for days on plan-tier paywalls).
    // Note: version created_at can slightly trail the exact lastModified (autosaves).
    const versions = await client.getVersions(fileKey);
    const lastModified = versions.versions?.[0]?.created_at;

    if (!lastModified) {
      console.error('Error: /versions returned no version — cannot determine last modification date');
      process.exit(1);
    }

    // Load existing meta
    const existing = loadExistingSnapshot(snapshotsDir);
    
    if (!existing || !existing.meta) {
      console.log('SYNC REQUIS — aucun snapshot local trouvé');
      process.exit(1);
    }

    const localLastModified = existing.meta.lastModified;

    // Compare as real timestamps — lexicographic comparison breaks on mixed ISO precisions
    if (Date.parse(lastModified) > Date.parse(localLastModified)) {
      console.log(`SYNC REQUIS (lastModified ${lastModified} > sync du ${localLastModified})`);
      process.exit(1);
    }

    console.log('À JOUR');
    process.exit(0);
  } catch (error: any) {
    if (error instanceof FigmaQuotaError) {
      console.error(`Quota Figma épuisé — impossible de vérifier maintenant. ${error.message}`);
      process.exit(2);
    }
    console.error(`Error checking sync status: ${error.message}`);
    process.exit(1);
  }
}

async function syncCommand(
  client: FigmaClient, 
  fileKey: string, 
  writer: any,
  snapshotsDir: string
): Promise<void> {
  console.log(`Starting sync for file ${fileKey}...`);
  const startTime = Date.now();

  try {
    // Initialize repo if needed
    initSnapshotsRepo(snapshotsDir);

    // Load existing snapshot for diff
    const existing = loadExistingSnapshot(snapshotsDir);

    // Capture all data
    const captureResult = await captureAll(client, fileKey);
    
    // Normalize
    const normalized = normalizeCapture(captureResult);

    // Guard against lastModified regression in gated mode (version date < autosave date)
    if (existing?.meta && normalized.meta.contentStatus === 'gated') {
      const maxDate = [existing.meta.lastModified, normalized.meta.lastModified]
        .map(d => Date.parse(d))
        .sort()
        .pop();
      normalized.meta.lastModified = new Date(maxDate!).toISOString();
    }

    // Compute diff
    const diff: DiffResult = existing
      ? computeDiff(
          {
            styles: existing.styles,
            components: existing.components?.components,
            componentSets: existing.components?.componentSets,
            pages: existing.structure?.pages,
            meta: existing.meta
          },
          {
            styles: normalized.styles,
            components: normalized.components.components,
            componentSets: normalized.components.componentSets,
            pages: normalized.structure.pages,
            meta: normalized.meta
          },
          { newGated: normalized.meta.contentStatus === 'gated' }
        )
      : {
          styles: { added: normalized.styles.length, removed: 0, changed: 0 },
          components: { added: normalized.components.components.length, removed: 0, changed: 0 },
          componentSets: { added: normalized.components.componentSets.length, removed: 0, changed: 0 },
          pages: { added: normalized.structure.pages.length, removed: 0, changed: 0 },
          hasChanges: true
        };

    // Write snapshot only when something changed — keeps the git repo clean
    // (no dirty meta.json with a fresh syncedAt and no commit to explain it).
    if (diff.hasChanges) {
      writeSnapshot(writer, normalized, captureResult.raw);

      // Update changelog
      const changelogEntry = generateChangelogEntry(diff, normalized.meta);
      updateChangelog(snapshotsDir, changelogEntry, diff);

      // Commit
      const commitMessage = `sync: ${normalized.meta.syncedAt} lastModified=${normalized.meta.lastModified}`;
      commitSnapshot(snapshotsDir, commitMessage);
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('');
    console.log('=== SYNC COMPLETE ===');
    console.log(`Duration: ${duration}s`);
    console.log(`Requests made: ${client.getRequestCount()}`);
    console.log(`Pages: ${normalized.meta.counts.pages}`);
    console.log(`Styles: ${normalized.meta.counts.styles}`);
    console.log(`Components: ${normalized.meta.counts.components}`);
    console.log(`Component Sets: ${normalized.meta.counts.componentSets}`);
    console.log(`Variables: ${normalized.variables.status} ${normalized.variables.reason ? `(${normalized.variables.reason})` : ''}`);
    console.log(`Content: ${normalized.meta.contentStatus}`);
    console.log(`Changes: ${diff.hasChanges ? 'yes (committed)' : 'no (snapshot kept as-is)'}`);
    
  } catch (error: any) {
    console.error(`Sync failed: ${error.message}`);
    process.exit(1);
  }
}

async function diffCommand(client: FigmaClient, fileKey: string, snapshotsDir: string): Promise<void> {
  console.log(`Computing diff for file ${fileKey}...`);

  try {
    const existing = loadExistingSnapshot(snapshotsDir);
    
    if (!existing) {
      console.log('No local snapshot found. Run "sync" first.');
      process.exit(1);
    }

    // Try to get previous commit from git
    try {
      const prevMeta = JSON.parse(
        execSync(`git show HEAD~1:meta.json 2>/dev/null || echo "null"`, { cwd: snapshotsDir, encoding: 'utf-8' })
      );
      
      if (prevMeta) {
        console.log('Previous snapshot (git HEAD~1):');
        console.log(`  lastModified: ${prevMeta.lastModified}`);
        console.log(`  syncedAt: ${prevMeta.syncedAt}`);
        console.log(`  pages: ${prevMeta.counts.pages}`);
        console.log(`  styles: ${prevMeta.counts.styles}`);
        console.log(`  components: ${prevMeta.counts.components}`);
        console.log(`  componentSets: ${prevMeta.counts.componentSets}`);
      }
    } catch {
      console.log('No previous git commit found.');
    }

    console.log('');
    console.log('Current snapshot:');
    console.log(`  lastModified: ${existing.meta.lastModified}`);
    console.log(`  syncedAt: ${existing.meta.syncedAt}`);
    console.log(`  pages: ${existing.meta.counts.pages}`);
    console.log(`  styles: ${existing.meta.counts.styles}`);
    console.log(`  components: ${existing.meta.counts.components}`);
    console.log(`  componentSets: ${existing.meta.counts.componentSets}`);

  } catch (error: any) {
    console.error(`Diff failed: ${error.message}`);
    process.exit(1);
  }
}

main();
