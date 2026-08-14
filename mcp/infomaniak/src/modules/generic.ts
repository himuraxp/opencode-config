/**
 * Generic module — 1 tool for calling any Infomaniak API endpoint.
 */

import { apiCall } from "../client.js";
import type { ToolDef } from "../types.js";

export const genericTool: ToolDef = {
  name: "infomaniak_api_call",
  description:
    "Call any Infomaniak API endpoint (577 endpoints available). Use this for endpoints not covered by dedicated tools. Base URL: https://api.infomaniak.com",
  inputSchema: {
    type: "object",
    properties: {
      method: {
        type: "string",
        enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        description: "HTTP method",
      },
      path: {
        type: "string",
        description:
          "API path starting with /, e.g. /2/vod/{product_id}/channels/{channel_id}/chapters",
      },
      body: {
        type: "object",
        description: "Request body (for POST/PUT/PATCH)",
      },
      params: {
        type: "object",
        description: "Query parameters",
      },
    },
    required: ["method", "path"],
  },
  handler: async (args) =>
    apiCall({
      method: args.method as "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
      path: args.path as string,
      body: args.body as Record<string, unknown>,
      params: args.params as Record<string, string | number | boolean | undefined>,
    }),
};
