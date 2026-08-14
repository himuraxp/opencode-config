/**
 * Shared types for MCP tool definitions.
 */

import { type Tool } from "@modelcontextprotocol/sdk/types.js";

export interface ToolDef {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>; // JSON Schema
  handler: (args: Record<string, unknown>) => Promise<unknown>;
}
