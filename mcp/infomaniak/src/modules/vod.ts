/**
 * VOD module — tools for video on demand management.
 *
 * Covers: products, channels, media, encodings, folders, playlists, statistics,
 * shares, players, subtitles, browse, upload, labels, metadata, rename.
 */

import { apiCall, apiCallMultipart } from "../client.js";
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
    description: "Get a specific VOD media by its media ID (no product_id needed)",
    inputSchema: {
      type: "object",
      properties: {
        media_id: { type: "string", description: "Media ID" },
      },
      required: ["media_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/2/vod/media/${args.media_id}`,
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

  // ─── Browse (1) ──────────────────────────────────────────────────────────────

  {
    name: "browse_vod_folder",
    description:
      "Browse contents of a VOD folder — returns medias and subfolders with their labels. Unlike list_vod_folders (root folders only), this navigates any folder by ID.",
    inputSchema: {
      type: "object",
      properties: {
        folder_id: { type: "string", description: "Folder ID to browse" },
        page: { type: "number", description: "Page number (default 1)" },
        per_page: {
          type: "number",
          description: "Items per page (default 15, max 100 recommended)",
        },
      },
      required: ["folder_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/2/vod/browse/${args.folder_id}`,
        params: {
          page: args.page as number | undefined,
          per_page: args.per_page as number | undefined,
        },
      }),
  },

  // ─── Upload (1) ─────────────────────────────────────────────────────────────

  {
    name: "upload_vod_media",
    description:
      "Upload a media file to a VOD channel folder via multipart/form-data. " +
      "The VOD system auto-extracts ID3 tags from MP3 files after upload (can take up to 10 minutes). " +
      "Note: filenames with commas can cause issues — rename to a simple name if needed.",
    inputSchema: {
      type: "object",
      properties: {
        channel_id: { type: "string", description: "VOD channel ID" },
        file_path: { type: "string", description: "Local file path to upload" },
        folder: {
          type: "string",
          description: "Destination folder ID (optional)",
        },
        name: {
          type: "string",
          description: "Custom file name (optional)",
        },
      },
      required: ["channel_id", "file_path"],
    },
    handler: async (args) => {
      const fields: Record<string, string> = {};
      if (args.folder) fields.folder = args.folder as string;
      if (args.name) fields.name = args.name as string;

      return apiCallMultipart({
        method: "POST",
        path: `/1/vod/channel/${args.channel_id}/upload`,
        filePath: args.file_path as string,
        fields: Object.keys(fields).length > 0 ? fields : undefined,
      });
    },
  },

  // ─── Labels (1) ─────────────────────────────────────────────────────────────

  {
    name: "update_vod_media_labels",
    description:
      "Replace all labels on a VOD media. PUT replaces the entire label set — does NOT append. " +
      "To preserve existing labels, include them all in the request. " +
      "Each label needs at least 'name'; 'options.color' is optional (hex like #ff540b). " +
      "Do not include 'id' in labels — the API rejects it.",
    inputSchema: {
      type: "object",
      properties: {
        media_id: { type: "string", description: "VOD media ID" },
        labels: {
          type: "array",
          description: "Array of label objects (name required, options optional)",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Label name" },
              options: {
                type: "object",
                properties: {
                  color: {
                    type: "string",
                    description: "Hex color, e.g. #ff540b",
                  },
                },
              },
            },
            required: ["name"],
          },
        },
      },
      required: ["media_id", "labels"],
    },
    handler: async (args) =>
      apiCall({
        method: "PUT",
        path: `/2/vod/media/${args.media_id}/labels`,
        body: { labels: args.labels },
      }),
  },

  // ─── Metadata (1) ───────────────────────────────────────────────────────────

  {
    name: "get_vod_media_metadata",
    description:
      "Get ID3 metadata (artist, album, title, year, genre) extracted from a VOD media file. " +
      "Types observed: genre, artist, album, year, title. " +
      "Note: the PUT endpoint for metadata appears broken on the API side — to modify metadata, " +
      "edit ID3 tags locally (e.g. with ffmpeg) and re-upload.",
    inputSchema: {
      type: "object",
      properties: {
        media_id: { type: "string", description: "VOD media ID" },
      },
      required: ["media_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/2/vod/media/${args.media_id}/metadata`,
      }),
  },

  // ─── Rename media (1) ────────────────────────────────────────────────────────

  {
    name: "update_vod_media",
    description:
      "Update a VOD media (e.g. rename). Use 'name' field, not 'title' — 'title' is ignored by the API.",
    inputSchema: {
      type: "object",
      properties: {
        media_id: { type: "string", description: "VOD media ID" },
        name: { type: "string", description: "New media name" },
      },
      required: ["media_id", "name"],
    },
    handler: async (args) =>
      apiCall({
        method: "PUT",
        path: `/2/vod/media/${args.media_id}`,
        body: { name: args.name },
      }),
  },

  // ─── Create folder (1) ──────────────────────────────────────────────────────

  {
    name: "create_vod_folder",
    description: "Create a VOD folder inside a channel",
    inputSchema: {
      type: "object",
      properties: {
        channel_id: { type: "string", description: "VOD channel ID" },
        name: { type: "string", description: "Folder name" },
        parent: {
          type: "string",
          description: "Parent folder ID (optional, for nested folders)",
        },
      },
      required: ["channel_id", "name"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/3/vod/channels/${args.channel_id}/folders`,
        body: {
          name: args.name,
          ...(args.parent ? { parent: args.parent } : {}),
        },
      }),
  },
];
