/**
 * VOD module — 15 tools for video on demand management.
 */

import { apiCall } from "../client.js";
import type { ToolDef } from "../types.js";

export const vodTools: ToolDef[] = [
  {
    name: "list_vod_products",
    description: "List VOD products with pagination",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        per_page: { type: "number", description: "Items per page" },
      },
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: "/2/vod",
        params: args as Record<string, string | number | boolean | undefined>,
      }),
  },
  {
    name: "get_vod_product",
    description: "Get a specific VOD product",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID" },
      },
      required: ["product_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/2/vod/${args.product_id}`,
      }),
  },
  {
    name: "list_vod_channels",
    description: "List VOD channels for a product",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID" },
      },
      required: ["product_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/2/vod/${args.product_id}/channels`,
      }),
  },
  {
    name: "get_vod_channel",
    description: "Get a specific VOD channel",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID" },
        channel_id: { type: "string", description: "Channel ID" },
      },
      required: ["product_id", "channel_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/2/vod/${args.product_id}/channels/${args.channel_id}`,
      }),
  },
  {
    name: "list_vod_media",
    description: "List VOD media for a product",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID" },
      },
      required: ["product_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/2/vod/${args.product_id}/media`,
      }),
  },
  {
    name: "get_vod_media",
    description: "Get a specific VOD media",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID" },
        media_id: { type: "string", description: "Media ID" },
      },
      required: ["product_id", "media_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/2/vod/${args.product_id}/media/${args.media_id}`,
      }),
  },
  {
    name: "list_vod_encodings",
    description: "List VOD encodings for a product",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID" },
      },
      required: ["product_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/2/vod/${args.product_id}/encodings`,
      }),
  },
  {
    name: "get_vod_encoding",
    description: "Get a specific VOD encoding",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID" },
        encoding_id: { type: "string", description: "Encoding ID" },
      },
      required: ["product_id", "encoding_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/2/vod/${args.product_id}/encodings/${args.encoding_id}`,
      }),
  },
  {
    name: "list_vod_statistics",
    description: "List VOD statistics for a product",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID" },
      },
      required: ["product_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/2/vod/${args.product_id}/statistics`,
      }),
  },
  {
    name: "list_vod_folders",
    description: "List VOD folders for a product",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID" },
      },
      required: ["product_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/2/vod/${args.product_id}/folders`,
      }),
  },
  {
    name: "list_vod_playlists",
    description: "List VOD playlists for a product",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID" },
      },
      required: ["product_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/2/vod/${args.product_id}/playlists`,
      }),
  },
  {
    name: "list_vod_shares",
    description: "List VOD shares for a product",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID" },
      },
      required: ["product_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/2/vod/${args.product_id}/shares`,
      }),
  },
  {
    name: "get_vod_disk_usage",
    description: "Get VOD disk usage for a product",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID" },
      },
      required: ["product_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/2/vod/${args.product_id}/disk-usage`,
      }),
  },
  {
    name: "list_vod_players",
    description: "List VOD players for a product",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID" },
      },
      required: ["product_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/2/vod/${args.product_id}/players`,
      }),
  },
  {
    name: "list_vod_subtitles",
    description: "List VOD subtitles for a product",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID" },
      },
      required: ["product_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/2/vod/${args.product_id}/subtitles`,
      }),
  },
];
