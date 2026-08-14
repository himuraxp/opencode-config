/**
 * DNS module — 11 tools for zone and DNS record management.
 */

import { apiCall } from "../client.js";
import type { ToolDef } from "../types.js";

export const dnsTools: ToolDef[] = [
  {
    name: "show_zone",
    description: "Show a DNS zone",
    inputSchema: {
      type: "object",
      properties: {
        zone: { type: "string", description: "Zone name" },
      },
      required: ["zone"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/2/zones/${args.zone}`,
      }),
  },
  {
    name: "update_zone",
    description: "Update a DNS zone",
    inputSchema: {
      type: "object",
      properties: {
        zone: { type: "string", description: "Zone name" },
        body: { type: "object", description: "Zone update data" },
      },
      required: ["zone", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "PUT",
        path: `/2/zones/${args.zone}`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "store_zone",
    description: "Store a DNS zone",
    inputSchema: {
      type: "object",
      properties: {
        zone: { type: "string", description: "Zone name" },
        body: { type: "object", description: "Zone data to store" },
      },
      required: ["zone", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/2/zones/${args.zone}`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "delete_zone",
    description: "Delete a DNS zone",
    inputSchema: {
      type: "object",
      properties: {
        zone: { type: "string", description: "Zone name" },
      },
      required: ["zone"],
    },
    handler: async (args) =>
      apiCall({
        method: "DELETE",
        path: `/2/zones/${args.zone}`,
      }),
  },
  {
    name: "zone_exists",
    description: "Check if a DNS zone exists",
    inputSchema: {
      type: "object",
      properties: {
        zone: { type: "string", description: "Zone name" },
      },
      required: ["zone"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/2/zones/${args.zone}/exists`,
      }),
  },
  {
    name: "list_dns_records",
    description: "List DNS records for a zone",
    inputSchema: {
      type: "object",
      properties: {
        zone: { type: "string", description: "Zone name" },
      },
      required: ["zone"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/2/zones/${args.zone}/records`,
      }),
  },
  {
    name: "create_dns_record",
    description: "Create a DNS record",
    inputSchema: {
      type: "object",
      properties: {
        zone: { type: "string", description: "Zone name" },
        body: { type: "object", description: "DNS record data" },
      },
      required: ["zone", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/2/zones/${args.zone}/records`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "get_dns_record",
    description: "Get a specific DNS record",
    inputSchema: {
      type: "object",
      properties: {
        zone: { type: "string", description: "Zone name" },
        record: { type: "string", description: "Record ID" },
      },
      required: ["zone", "record"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/2/zones/${args.zone}/records/${args.record}`,
      }),
  },
  {
    name: "update_dns_record",
    description: "Update a DNS record",
    inputSchema: {
      type: "object",
      properties: {
        zone: { type: "string", description: "Zone name" },
        record: { type: "string", description: "Record ID" },
        body: { type: "object", description: "Updated DNS record data" },
      },
      required: ["zone", "record", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "PUT",
        path: `/2/zones/${args.zone}/records/${args.record}`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "delete_dns_record",
    description: "Delete a DNS record",
    inputSchema: {
      type: "object",
      properties: {
        zone: { type: "string", description: "Zone name" },
        record: { type: "string", description: "Record ID" },
      },
      required: ["zone", "record"],
    },
    handler: async (args) =>
      apiCall({
        method: "DELETE",
        path: `/2/zones/${args.zone}/records/${args.record}`,
      }),
  },
  {
    name: "check_dns_record",
    description: "Check a DNS record",
    inputSchema: {
      type: "object",
      properties: {
        zone: { type: "string", description: "Zone name" },
        record: { type: "string", description: "Record ID" },
      },
      required: ["zone", "record"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/2/zones/${args.zone}/records/${args.record}/check`,
      }),
  },
];
