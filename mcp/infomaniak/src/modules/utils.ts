/**
 * Utils module — 15 tools for URL shortener and reference data.
 */

import { apiCall } from "../client.js";
import type { ToolDef } from "../types.js";

// ─── URL Shortener (7) ──────────────────────────────────────────────────────

export const urlShortenerTools: ToolDef[] = [
  {
    name: "list_short_urls",
    description: "List short URLs (v1)",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async () =>
      apiCall({
        method: "GET",
        path: "/1/url-shortener",
      }),
  },
  {
    name: "create_short_url",
    description: "Create a short URL (v1)",
    inputSchema: {
      type: "object",
      properties: {
        body: { type: "object", description: "Short URL data with url and optional title" },
      },
      required: ["body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: "/1/url-shortener",
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "update_short_url",
    description: "Update a short URL (v1)",
    inputSchema: {
      type: "object",
      properties: {
        short_url_code: { type: "string", description: "Short URL code" },
        body: { type: "object", description: "Updated short URL data" },
      },
      required: ["short_url_code", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "PUT",
        path: `/1/url-shortener/${args.short_url_code}`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "get_short_url_quota",
    description: "Get short URL quota (v1)",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async () =>
      apiCall({
        method: "GET",
        path: "/1/url-shortener/quota",
      }),
  },
  {
    name: "list_short_urls_v2",
    description: "List short URLs (v2)",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async () =>
      apiCall({
        method: "GET",
        path: "/2/url-shortener",
      }),
  },
  {
    name: "create_short_url_v2",
    description: "Create a short URL (v2)",
    inputSchema: {
      type: "object",
      properties: {
        body: { type: "object", description: "Short URL data with url and optional title" },
      },
      required: ["body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: "/2/url-shortener",
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "get_short_url_quota_v2",
    description: "Get short URL quota (v2)",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async () =>
      apiCall({
        method: "GET",
        path: "/2/url-shortener/quota",
      }),
  },
];

// ─── Reference Data (8) ─────────────────────────────────────────────────────

export const referenceDataTools: ToolDef[] = [
  {
    name: "list_countries",
    description: "List all countries",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async () =>
      apiCall({
        method: "GET",
        path: "/1/countries",
      }),
  },
  {
    name: "get_country",
    description: "Get a specific country by ID",
    inputSchema: {
      type: "object",
      properties: {
        country_id: { type: "string", description: "Country ID" },
      },
      required: ["country_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/countries/${args.country_id}`,
      }),
  },
  {
    name: "list_languages",
    description: "List all languages",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async () =>
      apiCall({
        method: "GET",
        path: "/1/languages",
      }),
  },
  {
    name: "get_language",
    description: "Get a specific language by ID",
    inputSchema: {
      type: "object",
      properties: {
        language_id: { type: "string", description: "Language ID" },
      },
      required: ["language_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/languages/${args.language_id}`,
      }),
  },
  {
    name: "list_timezones",
    description: "List all timezones",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async () =>
      apiCall({
        method: "GET",
        path: "/1/timezones",
      }),
  },
  {
    name: "get_timezone",
    description: "Get a specific timezone by ID",
    inputSchema: {
      type: "object",
      properties: {
        timezone_id: { type: "string", description: "Timezone ID" },
      },
      required: ["timezone_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/timezones/${args.timezone_id}`,
      }),
  },
];

// ─── Export all utils tools ─────────────────────────────────────────────────

export const utilsTools: ToolDef[] = [
  ...urlShortenerTools,
  ...referenceDataTools,
];
