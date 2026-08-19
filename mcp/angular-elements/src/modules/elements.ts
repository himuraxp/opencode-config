/**
 * Angular Elements MCP tools.
 *
 * 7 tools for browsing and reading the Infomaniak Angular Elements design system:
 * - list_components: list all available components
 * - search_components: search components by name
 * - get_component_docs: get full documentation (MDX content)
 * - get_component_api: get TypeScript API (inputs/outputs) from .component.ts
 * - get_component_stories: get stories metadata from .stories.ts
 * - get_install_info: get package.json (npm name, version, peer deps)
 * - get_changelog: get changelog content
 */

import { getStorybookIndex, getCachedFile, getCachedTree, type StorybookEntry } from "../client.js";
import type { ToolDef } from "../types.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Validate and return a non-empty component name from args.
 */
function requireComponent(args: Record<string, unknown>): string {
  const component = String(args.component || "").trim();
  if (!component) {
    throw new Error("Parameter 'component' is required and must be non-empty.");
  }
  return component;
}

/**
 * Normalize a component name to its folder form.
 * Storybook titles can be "Actions Menu" or "Actions-menu" but the repo folder is "actions-menu".
 */
function normalizeFolderName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Extract the component folder name from a storybook entry title.
 * e.g. "Elements/Button/ik-button" -> "button"
 * e.g. "Elements/Actions Menu/README" -> "actions-menu"
 */
function extractComponentFolder(title: string): string | null {
  const parts = title.split("/");
  if (parts[0] === "Elements" && parts.length >= 2) {
    return normalizeFolderName(parts[1]);
  }
  if (parts[0] === "Utilities" && parts.length >= 2) {
    return normalizeFolderName(parts[1]);
  }
  return null;
}

/**
 * Get all unique component folders from the storybook index.
 */
async function getComponentFolders(): Promise<Map<string, StorybookEntry[]>> {
  const index = await getStorybookIndex();
  const folders = new Map<string, StorybookEntry[]>();

  for (const entry of Object.values(index.entries)) {
    const folder = extractComponentFolder(entry.title);
    if (folder) {
      if (!folders.has(folder)) {
        folders.set(folder, []);
      }
      folders.get(folder)!.push(entry);
    }
  }

  return folders;
}

/**
 * Find the importPath of a specific sub-component's Docs.mdx for a given component folder.
 * e.g. for "button" and "ik-button", find the entry with title "Elements/Button/ik-button"
 */
async function findComponentDocEntry(componentFolder: string, subComponent?: string): Promise<StorybookEntry | null> {
  const index = await getStorybookIndex();
  const folderLower = componentFolder.toLowerCase();

  for (const entry of Object.values(index.entries)) {
    const folder = extractComponentFolder(entry.title);
    if (folder !== folderLower) continue;

    // If subComponent specified, match the last part of the title
    if (subComponent) {
      const parts = entry.title.split("/");
      const lastPart = parts[parts.length - 1].toLowerCase();
      if (lastPart === subComponent.toLowerCase()) {
        return entry;
      }
    } else {
      // Return the first docs entry that's not README or Changelog
      if (entry.type === "docs" && !entry.title.includes("README") && !entry.title.includes("Changelog") && !entry.title.includes("Guideline")) {
        return entry;
      }
    }
  }

  // Fallback: return the README entry
  for (const entry of Object.values(index.entries)) {
    const folder = extractComponentFolder(entry.title);
    if (folder === folderLower && entry.title.includes("README")) {
      return entry;
    }
  }

  return null;
}

/**
 * Resolve the GitLab file path from a storybook importPath.
 * e.g. "./projects/button/src/ik-button/Docs.mdx" -> "projects/button/src/ik-button/Docs.mdx"
 */
function importPathToGitlabPath(importPath: string): string {
  return importPath.replace(/^\.\//, "");
}

/**
 * Find all .component.ts files in a component's src directory by reading the GitLab tree.
 */
async function findComponentFiles(componentFolder: string): Promise<string[]> {
  // First, find the component directory name in projects/
  // Component folder names may differ from the storybook title (e.g. "Actions-menu" -> "actions-menu")
  // We need to check the actual directory in the repo
  const tree = await getCachedTree("projects");
  const dir = tree.find((n) => n.type === "tree" && n.name.toLowerCase() === componentFolder.toLowerCase());

  if (!dir) {
    throw new Error(`Component directory not found in projects/ for: ${componentFolder}`);
  }

  // Read the src directory
  const srcTree = await getCachedTree(`${dir.path}/src`);
  const componentFiles: string[] = [];

  // Recursively find .component.ts files
  for (const node of srcTree) {
    if (node.type === "tree") {
      const subTree = await getCachedTree(node.path);
      for (const subNode of subTree) {
        if (subNode.type === "blob" && subNode.name.endsWith(".component.ts")) {
          componentFiles.push(subNode.path);
        }
      }
    } else if (node.type === "blob" && node.name.endsWith(".component.ts")) {
      componentFiles.push(node.path);
    }
  }

  return componentFiles;
}

// ─── Tool: list_components ─────────────────────────────────────────────────────

export const listComponentsTool: ToolDef = {
  name: "list_components",
  description:
    "List all available Angular Elements components from the Infomaniak design system. Returns ~37 UI components and ~4 utilities with their storybook hierarchy.",
  inputSchema: {
    type: "object",
    properties: {},
  },
  handler: async () => {
    const index = await getStorybookIndex();
    const seen = new Map<string, { name: string; category: string; folder: string; subComponents: Set<string> }>();

    for (const entry of Object.values(index.entries)) {
      const parts = entry.title.split("/");
      if (parts.length < 2) continue;

      const category = parts[0];
      const name = parts[1];
      const folder = normalizeFolderName(name);
      const key = folder; // dedup by normalized folder name

      if (!seen.has(key)) {
        seen.set(key, { name, category, folder, subComponents: new Set() });
      }

      if (parts.length > 2) {
        seen.get(key)!.subComponents.add(parts.slice(2).join("/"));
      }
    }

    const components = Array.from(seen.values()).map((c) => ({
      name: c.name,
      category: c.category,
      folder: c.folder,
      subComponents: c.subComponents.size > 0 ? Array.from(c.subComponents) : undefined,
    }));

    return {
      total: components.length,
      components,
    };
  },
};

// ─── Tool: search_components ──────────────────────────────────────────────────

export const searchComponentsTool: ToolDef = {
  name: "search_components",
  description:
    "Search Angular Elements components by name or keyword. Returns matching components with their storybook paths.",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Search query (matches against component names and storybook titles)",
      },
    },
    required: ["query"],
  },
  handler: async (args) => {
    const query = String(args.query).toLowerCase();
    const index = await getStorybookIndex();
    const results: { title: string; id: string; type: string; importPath: string }[] = [];

    for (const entry of Object.values(index.entries)) {
      if (entry.title.toLowerCase().includes(query) || entry.id.toLowerCase().includes(query)) {
        results.push({
          title: entry.title,
          id: entry.id,
          type: entry.type,
          importPath: entry.importPath,
        });
      }
    }

    return {
      query: args.query,
      total: results.length,
      results,
    };
  },
};

// ─── Tool: get_component_docs ─────────────────────────────────────────────────

export const getComponentDocsTool: ToolDef = {
  name: "get_component_docs",
  description:
    "Get the full documentation for a component in MDX format. Includes introduction, usage examples, API table, variants, theming (CSS custom properties), and links to stories. Pass the component folder name (e.g. 'button', 'alert', 'actions-menu').",
  inputSchema: {
    type: "object",
    properties: {
      component: {
        type: "string",
        description: "Component folder name (e.g. 'button', 'alert', 'select', 'actions-menu')",
      },
      subComponent: {
        type: "string",
        description:
          "Optional sub-component name (e.g. 'ik-button', 'ik-buttons-group'). If omitted, returns the first available component docs.",
      },
    },
    required: ["component"],
  },
  handler: async (args) => {
    const component = requireComponent(args);
    const subComponent = args.subComponent ? String(args.subComponent) : undefined;

    const entry = await findComponentDocEntry(component, subComponent);
    if (!entry) {
      throw new Error(`No documentation found for component: ${component}${subComponent ? `/${subComponent}` : ""}`);
    }

    const gitlabPath = importPathToGitlabPath(entry.importPath);
    const content = await getCachedFile(gitlabPath);

    return {
      component,
      subComponent: subComponent || entry.title.split("/").pop(),
      storybookId: entry.id,
      storybookTitle: entry.title,
      sourceFile: gitlabPath,
      content,
    };
  },
};

// ─── Tool: get_component_api ───────────────────────────────────────────────────

export const getComponentApiTool: ToolDef = {
  name: "get_component_api",
  description:
    "Get the TypeScript API for a component — extracts inputs (InputSignal), outputs (OutputEmitterRef), and public methods from the .component.ts file. Returns parsed API metadata with types, descriptions (from JSDoc), and default values.",
  inputSchema: {
    type: "object",
    properties: {
      component: {
        type: "string",
        description: "Component folder name (e.g. 'button', 'alert', 'select')",
      },
      subComponent: {
        type: "string",
        description: "Optional sub-component selector (e.g. 'ik-button'). If omitted, returns API for all .component.ts files in the component's src directory.",
      },
    },
    required: ["component"],
  },
  handler: async (args) => {
    const component = requireComponent(args);
    const subComponent = args.subComponent ? String(args.subComponent) : undefined;

    const files = await findComponentFiles(component);

    if (files.length === 0) {
      throw new Error(`No .component.ts files found for component: ${component}`);
    }

    // If subComponent specified, filter to matching file
    const targetFiles = subComponent
      ? files.filter((f) => f.toLowerCase().includes(subComponent.toLowerCase().replace(/[^a-z0-9-]/g, "-")))
      : files;

    if (targetFiles.length === 0) {
      throw new Error(`No .component.ts file matching sub-component: ${subComponent}`);
    }

    const apis = await Promise.all(
      targetFiles.map(async (filePath) => {
        const content = await getCachedFile(filePath);
        return {
          file: filePath,
          selector: extractSelector(content),
          inputs: extractInputs(content),
          outputs: extractOutputs(content),
          methods: extractMethods(content),
        };
      }),
    );

    return {
      component,
      subComponent: subComponent || undefined,
      files: targetFiles,
      apis,
    };
  },
};

// ─── Tool: get_component_stories ───────────────────────────────────────────────

export const getComponentStoriesTool: ToolDef = {
  name: "get_component_stories",
  description:
    "Get the Storybook stories metadata for a component — extracts story names, argTypes (controls), default args, and the component class reference from the .stories.ts file.",
  inputSchema: {
    type: "object",
    properties: {
      component: {
        type: "string",
        description: "Component folder name (e.g. 'button', 'alert')",
      },
    },
    required: ["component"],
  },
  handler: async (args) => {
    const component = requireComponent(args);
    const index = await getStorybookIndex();
    const folderLower = component.toLowerCase();

    // Find all story entries for this component
    const storyEntries = Object.values(index.entries).filter((e) => {
      const folder = extractComponentFolder(e.title);
      return folder === folderLower && e.type === "story";
    });

    if (storyEntries.length === 0) {
      throw new Error(`No stories found for component: ${component}`);
    }

    // Find the stories.ts file from the first story entry's importPath
    // The importPath for stories is like "./projects/button/src/ik-button/ik-button.stories.ts"
    // But stories don't have importPath in the index — they're under the docs entry's storiesImports
    // Let's find the docs entry that has storiesImports
    const docsEntry = Object.values(index.entries).find((e) => {
      const folder = extractComponentFolder(e.title);
      return folder === folderLower && e.storiesImports && e.storiesImports.length > 0;
    });

    let storiesFileContent: string | undefined;
    let storiesFilePath: string | undefined;

    if (docsEntry?.storiesImports && docsEntry.storiesImports.length > 0) {
      storiesFilePath = importPathToGitlabPath(docsEntry.storiesImports[0]);
      storiesFileContent = await getCachedFile(storiesFilePath);
    }

    return {
      component,
      storiesFile: storiesFilePath,
      storiesFileContent: storiesFileContent
        ? {
            raw: storiesFileContent,
            argTypes: extractArgTypes(storiesFileContent),
            defaultArgs: extractDefaultArgs(storiesFileContent),
            storyNames: extractStoryNames(storiesFileContent),
          }
        : undefined,
      storybookStories: storyEntries.map((s) => ({
        id: s.id,
        title: s.title,
        name: s.name,
        importPath: s.importPath,
      })),
    };
  },
};

// ─── Tool: get_install_info ───────────────────────────────────────────────────

export const getInstallInfoTool: ToolDef = {
  name: "get_install_info",
  description:
    "Get installation information for a component — npm package name, version, peer dependencies, and regular dependencies from package.json.",
  inputSchema: {
    type: "object",
    properties: {
      component: {
        type: "string",
        description: "Component folder name (e.g. 'button', 'alert', 'forms')",
      },
    },
    required: ["component"],
  },
  handler: async (args) => {
    const component = requireComponent(args);

    const tree = await getCachedTree("projects");
    const dir = tree.find((n) => n.type === "tree" && n.name.toLowerCase() === component.toLowerCase());

    if (!dir) {
      throw new Error(`Component directory not found: ${component}`);
    }

    const packageJsonPath = `${dir.path}/package.json`;
    const content = await getCachedFile(packageJsonPath);
    let pkg: { name: string; version: string; peerDependencies?: Record<string, string>; dependencies?: Record<string, string> };
    try {
      pkg = JSON.parse(content);
    } catch {
      throw new Error(`Invalid package.json for component: ${component} at ${packageJsonPath}`);
    }

    // Also fetch README.md for install instructions
    let readme: string | undefined;
    try {
      readme = await getCachedFile(`${dir.path}/README.md`);
    } catch {
      // README.md may not exist for all components
    }

    return {
      component,
      npmPackage: pkg.name,
      version: pkg.version,
      peerDependencies: pkg.peerDependencies || {},
      dependencies: pkg.dependencies || {},
      install: {
        yarn: `yarn add ${pkg.name}@${pkg.version}`,
        npm: `npm i ${pkg.name}@${pkg.version}`,
      },
      installPeerDeps: buildPeerDepsInstall(pkg.peerDependencies || {}),
      readme,
    };
  },
};

// ─── Tool: get_changelog ──────────────────────────────────────────────────────

export const getChangelogTool: ToolDef = {
  name: "get_changelog",
  description:
    "Get the changelog for a component — version history with features, fixes, and breaking changes from CHANGELOG.md.",
  inputSchema: {
    type: "object",
    properties: {
      component: {
        type: "string",
        description: "Component folder name (e.g. 'button', 'alert')",
      },
    },
    required: ["component"],
  },
  handler: async (args) => {
    const component = requireComponent(args);

    const tree = await getCachedTree("projects");
    const dir = tree.find((n) => n.type === "tree" && n.name.toLowerCase() === component.toLowerCase());

    if (!dir) {
      throw new Error(`Component directory not found: ${component}`);
    }

    const content = await getCachedFile(`${dir.path}/CHANGELOG.md`);

    return {
      component,
      sourceFile: `${dir.path}/CHANGELOG.md`,
      content,
    };
  },
};

// ─── TypeScript parsing helpers ───────────────────────────────────────────────

/**
 * Extract the @Component selector from TypeScript source.
 */
function extractSelector(source: string): string | null {
  const match = source.match(/selector:\s*[\s\S]*?['"`]([^'"`]+)['"`]/);
  return match ? match[1] : null;
}

/**
 * Extract inputs (InputSignal) from a .component.ts file.
 * Matches patterns like:
 *   disabled: InputSignal<boolean> = input<boolean>(false);
 *   data = input<DataType>();
 *   readonly name = input<string>('');
 */
function extractInputs(source: string): { name: string; type: string; defaultValue: string | null; description: string | null }[] {
  const inputs: { name: string; type: string; defaultValue: string | null; description: string | null }[] = [];
  const seen = new Set<string>();

  // Strategy: find all `= input<...>(...)` assignments and extract the variable name + type
  // Pattern: [readonly] name[: InputSignal<T>] = input<T>(defaultValue)
  const inputRegex = /(?:readonly\s+)?(\w+)(?:\s*:\s*InputSignal<([^>]+)>)?\s*=\s*input(?:<([^>]+)>)?\s*\(([^)]*)\)/g;

  let match: RegExpExecArray | null;
  while ((match = inputRegex.exec(source)) !== null) {
    const name = match[1];
    if (seen.has(name)) continue;
    seen.add(name);

    const type = (match[2] || match[3] || "unknown").trim();
    const defaultValue = match[4].trim() || null;
    const description = extractJSDocBefore(source, match.index);

    inputs.push({ name, type, defaultValue, description });
  }

  return inputs;
}

/**
 * Extract outputs (OutputEmitterRef / EventEmitter) from a .component.ts file.
 */
function extractOutputs(source: string): { name: string; type: string; description: string | null }[] {
  const outputs: { name: string; type: string; description: string | null }[] = [];

  // Match `name = output<Type>()` (Angular output function)
  const outputRegex = /(?:readonly\s+)?(\w+)\s*=\s*output(?:<([^>]+)>)?\s*\(/g;
  // Match `name = new EventEmitter<Type>()`
  const emitterRegex = /(?:readonly\s+)?(\w+)\s*=\s*new\s+EventEmitter(?:<([^>]+)>)?\s*\(/g;

  const seen = new Set<string>();

  let match: RegExpExecArray | null;
  while ((match = outputRegex.exec(source)) !== null) {
    const name = match[1];
    if (seen.has(name)) continue;
    seen.add(name);
    outputs.push({
      name,
      type: match[2]?.trim() || "void",
      description: extractJSDocBefore(source, match.index),
    });
  }

  while ((match = emitterRegex.exec(source)) !== null) {
    const name = match[1];
    if (seen.has(name)) continue;
    seen.add(name);
    outputs.push({
      name,
      type: match[2]?.trim() || "void",
      description: extractJSDocBefore(source, match.index),
    });
  }

  return outputs;
}

/**
 * Extract public methods from a .component.ts file.
 * Excludes constructor, private methods, lifecycle hooks, and control-flow keywords.
 */
function extractMethods(source: string): { name: string; signature: string; description: string | null }[] {
  const methods: { name: string; signature: string; description: string | null }[] = [];

  // Match class methods: only at class body indentation level (2+ spaces at start of line)
  // `  methodName(args): returnType {` or `  async methodName(args): returnType {`
  const methodRegex = /^ {2}(?:public\s+)?(?:async\s+)?(\w+)\s*\(([^)]*)\)(?:\s*:\s*([^{]+?))?\s*\{/gm;
  const excludeKeywords = new Set([
    "constructor", "ngOnInit", "ngOnDestroy", "ngOnChanges",
    "ngAfterViewInit", "ngAfterContentInit", "ngDoCheck",
    "ngAfterContentChecked", "ngAfterViewChecked",
    // Control-flow keywords that can appear with parens
    "if", "for", "while", "switch", "catch",
    // Angular signal/injection calls commonly in constructors
    "effect", "computed", "inject",
  ]);

  let match: RegExpExecArray | null;
  while ((match = methodRegex.exec(source)) !== null) {
    const name = match[1];
    if (excludeKeywords.has(name) || name.startsWith("#") || name.startsWith("_")) continue;
    methods.push({
      name,
      signature: `(${match[2].trim()})${match[3] ? ": " + match[3].trim() : ""}`,
      description: extractJSDocBefore(source, match.index),
    });
  }

  return methods;
}

/**
 * Extract JSDoc comment block immediately preceding a position in source code.
 * Finds the nearest `/** ... *\/` block that ends within ~200 chars before the position.
 */
function extractJSDocBefore(source: string, position: number): string | null {
  // Look backwards from position for the nearest */ that closes a JSDoc block
  const searchStart = Math.max(0, position - 500);
  const before = source.substring(searchStart, position);

  // Find all JSDoc blocks in the search window
  const jsdocRegex = /\/\*\*([\s\S]*?)\*\//g;
  let lastMatch: RegExpExecArray | null = null;
  let match: RegExpExecArray | null;

  while ((match = jsdocRegex.exec(before)) !== null) {
    lastMatch = match;
  }

  if (!lastMatch) return null;

  // Verify there's only whitespace between the end of this JSDoc and the match position
  const endOfJsdoc = searchStart + lastMatch.index + lastMatch[0].length;
  const between = source.substring(endOfJsdoc, position);
  if (between.trim().length > 0) return null;

  // Clean up: remove * prefixes and @ignore tags
  const lines = lastMatch[1]
    .split("\n")
    .map((l) => l.replace(/^\s*\*\s?/, "").trim())
    .filter((l) => l && !l.startsWith("@ignore"));

  return lines.length > 0 ? lines.join(" ") : null;
}

/**
 * Extract argTypes from a .stories.ts file.
 */
function extractArgTypes(source: string): Record<string, { type: string; description?: string; options?: string[]; control?: string }> {
  const argTypes: Record<string, { type: string; description?: string; options?: string[]; control?: string }> = {};

  // Match argTypes blocks: `fieldName: { type: 'boolean', description: '...' }`
  const argTypeRegex = /(\w+):\s*\{([^}]+)\}/g;
  let match: RegExpExecArray | null;
  while ((match = argTypeRegex.exec(source)) !== null) {
    const name = match[1];
    const block = match[2];
    if (block.includes("type") || block.includes("control") || block.includes("description")) {
      const typeMatch = block.match(/type:\s*['"]([^'"]+)['"]/);
      const descMatch = block.match(/description:\s*['"]([^'"]+)['"]/);
      const optionsMatch = block.match(/options:\s*\[([^\]]+)\]/);
      const controlMatch = block.match(/control:\s*['"]([^'"]+)['"]/);
      argTypes[name] = {
        type: typeMatch ? typeMatch[1] : "unknown",
        description: descMatch ? descMatch[1] : undefined,
        options: optionsMatch ? optionsMatch[1].split(",").map((s) => s.trim().replace(/['"]/g, "")) : undefined,
        control: controlMatch ? controlMatch[1] : undefined,
      };
    }
  }

  return argTypes;
}

/**
 * Extract default args from a .stories.ts file.
 * Values are returned as raw source snippets (strings) for transparency.
 */
function extractDefaultArgs(source: string): Record<string, string> {
  const argsMatch = source.match(/args:\s*\{([^}]+)\}/s);
  if (!argsMatch) return {};

  const args: Record<string, string> = {};
  const argRegex = /(\w+):\s*([^,\n]+)/g;
  let match: RegExpExecArray | null;
  while ((match = argRegex.exec(argsMatch[1])) !== null) {
    args[match[1]] = match[2].trim();
  }

  return args;
}

/**
 * Extract story names from a .stories.ts file.
 */
function extractStoryNames(source: string): string[] {
  const names: string[] = [];
  // Match `export const StoryName: StoryObj = {` or `StoryName: StoryObj<...> = {`
  const storyRegex = /export\s+const\s+(\w+)\s*:\s*StoryObj/g;
  let match: RegExpExecArray | null;
  while ((match = storyRegex.exec(source)) !== null) {
    names.push(match[1]);
  }
  return names;
}

/**
 * Build peer dependencies install commands.
 */
function buildPeerDepsInstall(peerDeps: Record<string, string>): { yarn: string; npm: string } {
  const depList = Object.entries(peerDeps).map(([name, version]) => `${name}@${version}`);
  return {
    yarn: `yarn add ${depList.join(" ")}`,
    npm: `npm i ${depList.join(" ")}`,
  };
}
