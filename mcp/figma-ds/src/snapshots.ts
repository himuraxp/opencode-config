/**
 * Snapshot writer with git commit support
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync, execFileSync } from 'node:child_process';
import { NormalizedOutput } from './normalize.js';

export interface SnapshotWriter {
  dir: string;
}

export function createSnapshotWriter(dir: string): SnapshotWriter {
  return { dir };
}

/**
 * Initialize snapshots repository if not exists
 */
export function initSnapshotsRepo(dir: string): void {
  if (!fs.existsSync(dir)) {
    console.log(`Creating snapshots directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }

  // Initialize git repo if not already
  if (!fs.existsSync(path.join(dir, '.git'))) {
    console.log('Initializing git repository...');
    execSync('git init', { cwd: dir, stdio: 'inherit' });
    
    // Create .gitignore
    const gitignore = path.join(dir, '.gitignore');
    if (!fs.existsSync(gitignore)) {
      fs.writeFileSync(gitignore, 'raw/*.json\n!.gitignore\n');
    }

    // Initial commit
    try {
      execSync('git add .gitignore', { cwd: dir, stdio: 'inherit' });
      execSync('git commit -m "Initial commit"', { cwd: dir, stdio: 'inherit' });
    } catch {
      // Git commit may fail without user config, that's ok for now
      console.log('Warning: Initial git commit skipped (git user config not configured)');
    }
  }
}

/**
 * Write snapshot files atomically
 */
export function writeSnapshot(writer: SnapshotWriter, data: NormalizedOutput, raw: any): void {
  const { dir } = writer;

  // Write meta.json
  writeAtomic(path.join(dir, 'meta.json'), JSON.stringify(data.meta, null, 2));

  // Write structure.json
  writeAtomic(path.join(dir, 'structure.json'), JSON.stringify(data.structure, null, 2));

  // Write styles.json
  writeAtomic(path.join(dir, 'styles.json'), JSON.stringify(data.styles, null, 2));

  // Write components.json
  writeAtomic(path.join(dir, 'components.json'), JSON.stringify(data.components, null, 2));

  // Write variables.json
  writeAtomic(path.join(dir, 'variables.json'), JSON.stringify(data.variables, null, 2));

  // Write raw data
  const rawDir = path.join(dir, 'raw');
  if (!fs.existsSync(rawDir)) {
    fs.mkdirSync(rawDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  writeAtomic(
    path.join(rawDir, `file-${timestamp}.json`),
    JSON.stringify(raw.fileData, null, 2)
  );
  writeAtomic(
    path.join(rawDir, `styles-meta-${timestamp}.json`),
    JSON.stringify(raw.stylesMeta, null, 2)
  );
  writeAtomic(
    path.join(rawDir, `components-meta-${timestamp}.json`),
    JSON.stringify(raw.componentsMeta, null, 2)
  );
  writeAtomic(
    path.join(rawDir, `component-sets-meta-${timestamp}.json`),
    JSON.stringify(raw.componentSetsMeta, null, 2)
  );
  if (raw.nodesBatch && Object.keys(raw.nodesBatch).length > 0) {
    writeAtomic(
      path.join(rawDir, `nodes-batch-${timestamp}.json`),
      JSON.stringify(raw.nodesBatch, null, 2)
    );
  }
}

/**
 * Write file atomically (write to tmp, then rename)
 */
function writeAtomic(filePath: string, content: string): void {
  const tmpPath = `${filePath}.tmp.${process.pid}`;
  try {
    fs.writeFileSync(tmpPath, content);
    fs.renameSync(tmpPath, filePath);
  } catch (error) {
    // Cleanup tmp file on error
    if (fs.existsSync(tmpPath)) {
      fs.unlinkSync(tmpPath);
    }
    throw error;
  }
}

/**
 * Load existing snapshot data if available
 */
export function loadExistingSnapshot(dir: string): NormalizedOutput | null {
  try {
    const meta = fs.existsSync(path.join(dir, 'meta.json')) 
      ? JSON.parse(fs.readFileSync(path.join(dir, 'meta.json'), 'utf-8')) 
      : null;
    const structure = fs.existsSync(path.join(dir, 'structure.json'))
      ? JSON.parse(fs.readFileSync(path.join(dir, 'structure.json'), 'utf-8'))
      : null;
    const styles = fs.existsSync(path.join(dir, 'styles.json'))
      ? JSON.parse(fs.readFileSync(path.join(dir, 'styles.json'), 'utf-8'))
      : null;
    const components = fs.existsSync(path.join(dir, 'components.json'))
      ? JSON.parse(fs.readFileSync(path.join(dir, 'components.json'), 'utf-8'))
      : null;
    const variables = fs.existsSync(path.join(dir, 'variables.json'))
      ? JSON.parse(fs.readFileSync(path.join(dir, 'variables.json'), 'utf-8'))
      : null;

    if (!meta) return null;

    return { meta, structure, styles, components, variables };
  } catch {
    return null;
  }
}

/**
 * Update CHANGELOG.md with new entry
 */
export function updateChangelog(dir: string, entry: string, diff: any): void {
  const changelogPath = path.join(dir, 'CHANGELOG.md');
  let content = '';

  if (fs.existsSync(changelogPath)) {
    content = fs.readFileSync(changelogPath, 'utf-8');
  } else {
    content = '# Figma Design System Snapshots Changelog\n\n';
  }

  // Only add entry if there are changes or it's the first sync
  if (diff.hasChanges || !content.includes('## Sync du')) {
    const newContent = `${entry}\n${content}`;
    writeAtomic(changelogPath, newContent);
  }
}

/**
 * Commit snapshot to git
 */
export function commitSnapshot(dir: string, message: string): void {
  try {
    execSync('git add -A', { cwd: dir, stdio: 'inherit' });
    // execFileSync avoids shell interpolation of the commit message
    execFileSync('git', ['commit', '-m', message], { cwd: dir, stdio: 'inherit' });
    console.log(`Committed: ${message}`);
  } catch (error) {
    console.error('Git commit failed:', error);
  }
}
