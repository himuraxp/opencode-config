#!/usr/bin/env node
/**
 * Infomaniak MCP Server — Entry point.
 *
 * Exposes all tools via stdio transport.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { coreTools } from "./modules/core.js";
import { aiTools } from "./modules/ai.js";
import { dnsTools } from "./modules/dns.js";
import { utilsTools } from "./modules/utils.js";
import { newsletterTools } from "./modules/newsletter.js";
import { vodTools } from "./modules/vod.js";
import { radioTools } from "./modules/radio.js";
import { genericTool } from "./modules/generic.js";

const allTools = [
  ...coreTools,
  ...aiTools,
  ...dnsTools,
  ...utilsTools,
  ...newsletterTools,
  ...vodTools,
  ...radioTools,
  genericTool,
];

const server = new Server(
  { name: "infomaniak-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: allTools.map((t) => ({
    name: t.name,
    description: t.description,
    inputSchema: t.inputSchema,
  })),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = allTools.find((t) => t.name === request.params.name);
  if (!tool) {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }
  const result = await tool.handler(request.params.arguments || {});
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
});

const transport = new StdioServerTransport();
await server.connect(transport);
