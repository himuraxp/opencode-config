/**
 * Figma ↔ Angular Elements (ik-*) mapping generator.
 *
 * Works purely from LOCAL data (no Figma API call — quota-proof):
 *   - Figma side  : <snapshots>/components.json (families derived from component names)
 *   - Code side   : tools/figma-ds/ik-components.reference.json (manual reference)
 *
 * Regenerated ONLY on demand (`mapping` command). Manual corrections
 * (entries with confidence === "manual") survive regeneration.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REFERENCE_FILE = path.join(__dirname, '..', 'ik-components.reference.json');
const FAMILIES_FILE = path.join(__dirname, '..', 'figma-families.reference.json');

export interface MappingEntry {
  figma: string;
  ik: string;
  confidence: 'exact' | 'fuzzy' | 'manual';
  figmaComponentCount?: number;
  note?: string;
}

export interface MappingResult {
  generatedAt: string;
  entries: MappingEntry[];
  figmaOnly: string[];
  codeOnly: string[];
}

interface IkComponent {
  name: string;
  category: string;
}

// ─── Normalization helpers ──────────────────────────────────────────────────

/** Lowercase, strip emoji/punctuation, separators → single space. */
function normalizeName(name: string): string {
  return name
    .replace(/[\u{1F000}-\u{1FAFF}\u{2190}-\u{27BF}\u{FE0F}]/gu, ' ')
    .toLowerCase()
    .replace(/[^a-z0-9\s/]/g, ' ')
    .replace(/[/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripPlural(word: string): string {
  if (word.endsWith('ies')) return word.slice(0, -3) + 'y';
  if (word.endsWith('es') && word.length > 4) return word.slice(0, -2);
  if (word.endsWith('s') && word.length > 3) return word.slice(0, -1);
  return word;
}

function tokens(name: string): string[] {
  return normalizeName(name).split(' ').filter(Boolean).map(stripPlural);
}

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[a.length][b.length];
}

/**
 * Score in [0, 1]. A full-token containment (ik name present as a Figma token,
 * or the reverse) weighs more than raw token overlap.
 */
function scoreMatch(figmaName: string, ikName: string): number {
  const tokA = tokens(figmaName);
  const tokB = tokens(ikName);
  if (tokA.length === 0 || tokB.length === 0) return 0;

  const setA = new Set(tokA);
  const setB = new Set(tokB);
  let overlap = 0;
  for (const t of setA) if (setB.has(t)) overlap++;
  const tokenScore = overlap / Math.max(setA.size, setB.size);

  // containment: the ik name (as tokens) appears inside the Figma family name, or the reverse
  const containmentScore = (setB.has(tokA.join(' ')) || setA.has(tokB.join(' '))) ? 0.8 : 0;

  const joinedA = tokA.join(' ');
  const joinedB = tokB.join(' ');
  const dist = levenshtein(joinedA, joinedB);
  const levScore = 1 - dist / Math.max(joinedA.length, joinedB.length);

  return Math.max(tokenScore, containmentScore, levScore);
}

// ── Family source ────────────────────────────────────────────────────────────

interface FamilyInfo {
  name: string;
  componentCount?: number;
}

/**
 * Priority: manual reference of the COMPONENTS page sub-pages (exact, quota-proof,
 * maintained on demand). Fallback: derive families from component name prefixes
 * (noisy on this file — mixes DS components with product mockups).
 */
function getFamilies(componentsPayload: any): Map<string, FamilyInfo> {
  const families = new Map<string, FamilyInfo>();

  if (fs.existsSync(FAMILIES_FILE)) {
    const ref = JSON.parse(fs.readFileSync(FAMILIES_FILE, 'utf-8'));
    for (const name of ref.families ?? []) {
      families.set(name, { name });
    }
    return families;
  }

  const bump = (raw: string) => {
    const first = normalizeName(raw).split(' ')[0];
    if (!first) return;
    const existing = families.get(first);
    families.set(first, existing
      ? { name: first, componentCount: (existing.componentCount || 0) + 1 }
      : { name: first, componentCount: 1 });
  };
  for (const c of componentsPayload?.components ?? []) bump(c.name);
  for (const s of componentsPayload?.componentSets ?? []) bump(s.name);
  return families;
}

// ── Main entry ───────────────────────────────────────────────────────────────

export function generateMapping(snapshotsDir: string, dryRun = false): MappingResult {
  const componentsPath = path.join(snapshotsDir, 'components.json');
  if (!fs.existsSync(componentsPath)) {
    throw new Error(`No snapshot found at ${componentsPath} — run "sync" first.`);
  }
  const componentsPayload = JSON.parse(fs.readFileSync(componentsPath, 'utf-8'));
  const reference = JSON.parse(fs.readFileSync(REFERENCE_FILE, 'utf-8'));
  const ikComponents: IkComponent[] = reference.components ?? [];

  // 1. Manual entries survive regeneration
  const mappingPath = path.join(snapshotsDir, 'mapping.json');
  const existing: MappingResult | null = fs.existsSync(mappingPath)
    ? JSON.parse(fs.readFileSync(mappingPath, 'utf-8'))
    : null;
  const manualEntries = (existing?.entries ?? []).filter(e => e.confidence === 'manual');
  const manualIkSet = new Set(manualEntries.map(e => e.ik));

  // 2. Families + candidates
  const families = getFamilies(componentsPayload);
  const remainingIk = new Set(
    ikComponents.map(c => c.name).filter(n => !manualIkSet.has(n))
  );

  // 3. Score all pairs
  type Candidate = { figma: string; ik: string; score: number };
  const candidates: Candidate[] = [];
  for (const [figmaFamily] of families) {
    for (const ik of remainingIk) {
      const score = scoreMatch(figmaFamily, ik);
      if (score >= 0.5) candidates.push({ figma: figmaFamily, ik, score });
    }
  }
  // Greedy: highest score first, one ik per figma family, one figma per ik
  candidates.sort((a, b) => b.score - a.score);
  const usedFigma = new Set<string>(manualEntries.map(e => e.figma));
  const autoEntries: MappingEntry[] = [];
  for (const c of candidates) {
    if (usedFigma.has(c.figma) || !remainingIk.has(c.ik)) continue;
    usedFigma.add(c.figma);
    remainingIk.delete(c.ik);
    autoEntries.push({
      figma: c.figma,
      ik: c.ik,
      confidence: c.score === 1 ? 'exact' : 'fuzzy',
      note: c.score === 1 ? undefined : `score ${c.score.toFixed(2)} — validate or edit to "manual"`
    });
  }

  const entries = [...manualEntries, ...autoEntries].sort((a, b) => a.figma.localeCompare(b.figma));
  const matchedIk = new Set(entries.map(e => e.ik));
  const figmaOnly = [...families.keys()].filter(f => !usedFigma.has(f)).sort();
  const codeOnly = ikComponents.map(c => c.name).filter(n => !matchedIk.has(n)).sort();

  const result: MappingResult = {
    generatedAt: new Date().toISOString(),
    entries,
    figmaOnly,
    codeOnly
  };

  const changed = !existing || JSON.stringify({ ...result, generatedAt: null }) !== JSON.stringify({ ...existing, generatedAt: null });
  if (changed && !dryRun) {
    writeAtomic(mappingPath, JSON.stringify(result, null, 2));
    commitMapping(snapshotsDir, result);
  }

  printReport(result, dryRun);
  return result;
}

function writeAtomic(filePath: string, content: string): void {
  const tmpPath = `${filePath}.tmp.${process.pid}`;
  fs.writeFileSync(tmpPath, content);
  fs.renameSync(tmpPath, filePath);
}

function commitMapping(dir: string, result: MappingResult): void {
  try {
    execSync('git add mapping.json', { cwd: dir, stdio: 'ignore' });
    const exact = result.entries.filter(e => e.confidence === 'exact').length;
    const fuzzy = result.entries.filter(e => e.confidence === 'fuzzy').length;
    const manual = result.entries.filter(e => e.confidence === 'manual').length;
    execFileSync('git', ['commit', '-m', `mapping: ${result.entries.length} matchs (${exact} exact, ${fuzzy} fuzzy, ${manual} manual)`], { cwd: dir, stdio: 'ignore' });
    console.log('mapping.json committed');
  } catch (error) {
    console.error('Git commit (mapping) failed:', error);
  }
}

function printReport(result: MappingResult, dryRun: boolean): void {
  console.log('');
  console.log(`=== MAPPING (${dryRun ? 'dry-run, not written' : 'written'}) ===`);
  const byConf = (c: string) => result.entries.filter(e => e.confidence === c);
  console.log(`Matched: ${result.entries.length} (exact: ${byConf('exact').length}, fuzzy: ${byConf('fuzzy').length}, manual: ${byConf('manual').length})`);
  for (const e of result.entries) {
    const badge = e.confidence === 'exact' ? '✓' : e.confidence === 'manual' ? '★' : '~';
    console.log(`  ${badge} ${e.figma}  →  ik-${e.ik}${e.figmaComponentCount ? ` (${e.figmaComponentCount} composants Figma)` : ''}`);
  }
  if (result.figmaOnly.length) {
    console.log(`Figma sans implémentation code (${result.figmaOnly.length}) : ${result.figmaOnly.join(', ')}`);
  }
  if (result.codeOnly.length) {
    console.log(`Composants ik-* sans famille Figma détectée (${result.codeOnly.length}) : ${result.codeOnly.join(', ')}`);
  }
  console.log('');
  console.log('Pour corriger : éditer mapping.json → passer confidence à "manual" (préservé à la prochaine régénération).');
}
