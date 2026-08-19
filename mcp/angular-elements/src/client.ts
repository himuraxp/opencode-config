/**
 * GitLab API client for the Angular Elements repository.
 *
 * Reads files from the `infomaniak/front/angular-elements` GitLab project
 * to extract component documentation, API, stories, and package metadata.
 *
 * Also fetches the Storybook `index.json` for the full story catalog.
 */

import fs from "fs";
import path from "path";
import os from "os";

const GITLAB_API = "https://gitlab.infomaniak.ch/api/v4";
const PROJECT_ID = 3760; // infomaniak/front/angular-elements
const STORYBOOK_BASE = "https://infomaniak.pages.infomaniak.com/front/angular-elements";
const REF = "master";

/** Storybook index.json entry */
export interface StorybookEntry {
  id: string;
  title: string;
  name: string;
  importPath: string;
  type: "docs" | "story";
  tags: string[];
  storiesImports?: string[];
}

export interface StorybookIndex {
  v: number;
  entries: Record<string, StorybookEntry>;
}

// ─── Token resolution ──────────────────────────────────────────────────────────

function getToken(): string {
  const envToken = process.env.GITLAB_TOKEN;
  if (envToken && envToken.length > 0) return envToken;

  // Fallback: read from ~/.config/opencode/.env
  try {
    const envPath = path.join(os.homedir(), ".config", "opencode", ".env");
    const envContent = fs.readFileSync(envPath, "utf-8");

    const match = envContent.match(/^GITLAB_TOKEN\s*=\s*(.+)$/m);
    if (match) {
      const token = match[1].trim().replace(/^["']|["']$/g, "");
      if (token) return token;
    }
  } catch {
    // fall through
  }

  throw new Error(
    "GITLAB_TOKEN environment variable is not set. Set it in ~/.config/opencode/.env or pass it via the MCP env config.",
  );
}

// ─── GitLab file reader ────────────────────────────────────────────────────────

/**
 * Fetch a raw file from the GitLab repository.
 * @param filePath - Path within the repo (e.g. "projects/button/src/ik-button/ik-button.component.ts")
 * @returns Raw file content
 */
export async function getGitlabFile(filePath: string): Promise<string> {
  const token = getToken();
  const encodedPath = encodeURIComponent(filePath);
  const url = `${GITLAB_API}/projects/${PROJECT_ID}/repository/files/${encodedPath}/raw?ref=${REF}`;

  const res = await fetch(url, {
    headers: { "PRIVATE-TOKEN": token },
  });

  if (!res.ok) {
    throw new Error(`GitLab API error ${res.status}: ${res.statusText} for path: ${filePath}`);
  }

  return res.text();
}

/**
 * List the contents of a directory in the repository.
 */
export async function getGitlabTree(dirPath: string, perPage = 100): Promise<GitlabTreeNode[]> {
  const token = getToken();
  const encodedPath = encodeURIComponent(dirPath);
  const url = `${GITLAB_API}/projects/${PROJECT_ID}/repository/tree?ref=${REF}&path=${encodedPath}&per_page=${perPage}`;

  const res = await fetch(url, {
    headers: { "PRIVATE-TOKEN": token },
  });

  if (!res.ok) {
    throw new Error(`GitLab API error ${res.status}: ${res.statusText} for tree: ${dirPath}`);
  }

  return res.json() as Promise<GitlabTreeNode[]>;
}

export interface GitlabTreeNode {
  id: string;
  name: string;
  type: "tree" | "blob";
  path: string;
  mode: string;
}

// ─── Storybook index ──────────────────────────────────────────────────────────

/** Cached index.json */
let cachedIndex: StorybookIndex | null = null;
let cachedIndexTime = 0;
const INDEX_TTL_MS = 3600_000; // 1 hour

/**
 * Fetch the Storybook index.json containing all stories and docs entries.
 */
export async function getStorybookIndex(): Promise<StorybookIndex> {
  const now = Date.now();
  if (cachedIndex && now - cachedIndexTime < INDEX_TTL_MS) {
    return cachedIndex;
  }

  const url = `${STORYBOOK_BASE}/index.json`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch Storybook index.json: ${res.status} ${res.statusText}`);
  }

  cachedIndex = (await res.json()) as StorybookIndex;
  cachedIndexTime = now;
  return cachedIndex;
}

// ─── File cache ───────────────────────────────────────────────────────────────

const fileCache = new Map<string, { content: string; time: number }>();
const treeCache = new Map<string, { data: GitlabTreeNode[]; time: number }>();
const CACHE_TTL_MS = 3600_000; // 1 hour

/**
 * Fetch a GitLab file with caching.
 */
export async function getCachedFile(filePath: string): Promise<string> {
  const now = Date.now();
  const cached = fileCache.get(filePath);
  if (cached && now - cached.time < CACHE_TTL_MS) {
    return cached.content;
  }

  const content = await getGitlabFile(filePath);
  fileCache.set(filePath, { content, time: now });
  return content;
}

/**
 * Fetch a GitLab tree with caching.
 */
export async function getCachedTree(dirPath: string): Promise<GitlabTreeNode[]> {
  const now = Date.now();
  const cached = treeCache.get(dirPath);
  if (cached && now - cached.time < CACHE_TTL_MS) {
    return cached.data;
  }

  const data = await getGitlabTree(dirPath);
  treeCache.set(dirPath, { data, time: now });
  return data;
}
