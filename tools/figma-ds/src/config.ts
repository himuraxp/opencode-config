/**
 * Configuration — token loading, paths, defaults
 */
import * as fs from 'node:fs';

export const DEFAULT_FILE_KEY = 'J09Rdl0amcTh5VetJmnUL5';
// Fallback name when the /files endpoint is gated by Figma's API quota
// (the dedicated endpoints /styles, /components, /versions stay available).
export const DEFAULT_FILE_NAME = 'Manager Design System';
export const DEFAULT_SNAPSHOTS_DIR = `${process.env.HOME}/dev/infomaniak-ds-snapshots`;
export const DEFAULT_ENV_FILE = `${process.env.HOME}/.config/opencode/.env`;

export interface Config {
  figmaToken: string;
  fileKey: string;
  snapshotsDir: string;
  envFilePath: string;
}

/**
 * Load token from environment or env file
 */
export function loadConfig(): Config {
  const figmaToken = process.env.FIGMA_TOKEN || loadTokenFromFile();
  const fileKey = process.env.FIGMA_DS_FILE_KEY || DEFAULT_FILE_KEY;
  const snapshotsDir = process.env.FIGMA_DS_SNAPSHOTS_DIR || DEFAULT_SNAPSHOTS_DIR;
  const envFilePath = process.env.OPENCODE_ENV_FILE || DEFAULT_ENV_FILE;

  if (!figmaToken) {
    throw new Error(
      'FIGMA_TOKEN not found. Set environment variable FIGMA_TOKEN or add FIGMA_TOKEN=... to ~/.config/opencode/.env'
    );
  }

  return { figmaToken, fileKey, snapshotsDir, envFilePath };
}

function loadTokenFromFile(): string | undefined {
  const envFilePath = process.env.OPENCODE_ENV_FILE || DEFAULT_ENV_FILE;
  try {
    if (!fs.existsSync(envFilePath)) {
      return undefined;
    }
    const content = fs.readFileSync(envFilePath, 'utf-8');
    const match = content.match(/^FIGMA_TOKEN=(.+)$/m);
    const value = match?.[1]?.trim() ?? '';
    // Strip wrapping quotes — a quoted value would be rejected by Figma as an opaque 403
    const unquoted = value.replace(/^["']|["']$/g, '');
    return unquoted || undefined;
  } catch {
    return undefined;
  }
}
