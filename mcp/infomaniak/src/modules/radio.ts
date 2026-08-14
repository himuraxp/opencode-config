/**
 * Radio module — tools for streaming radio management.
 *
 * Covers: products, stations, streams, AutoDJ (playlists, playing playlist, advanced playlists),
 * players, options, notifications, HLS streams, and relays.
 *
 * All endpoints use the /1/radios prefix.
 */

import { apiCall } from "../client.js";
import type { ToolDef } from "../types.js";

export const radioTools: ToolDef[] = [
  // ─── Radio Products (2) ─────────────────────────────────────────────────────
  {
    name: "list_radios",
    description: "List all radio products with optional filtering and pagination",
    inputSchema: {
      type: "object",
      properties: {
        account_id: { type: "string", description: "Filter by account ID" },
        with: {
          type: "string",
          description:
            "Include related data. Possible values: pack, listeners, stations, stations.streams, stations.streams.is_up, stations.hls_stream, monthly_consumption",
        },
        page: { type: "number", description: "Page number" },
        per_page: { type: "number", description: "Items per page" },
      },
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: "/1/radios",
        params: args as Record<string, string | number | boolean | undefined>,
      }),
  },
  {
    name: "get_radio",
    description: "Get a specific radio product by ID",
    inputSchema: {
      type: "object",
      properties: {
        radio_product_id: { type: "string", description: "Radio product ID" },
        with: {
          type: "string",
          description:
            "Include related data. Possible values: pack, listeners, stations, stations.streams, stations.streams.is_up, stations.hls_stream, monthly_consumption",
        },
      },
      required: ["radio_product_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/radios/${args.radio_product_id}`,
        params: { with: args.with } as Record<string, string | number | boolean | undefined>,
      }),
  },
  {
    name: "update_radio",
    description: "Update a radio product",
    inputSchema: {
      type: "object",
      properties: {
        radio_product_id: { type: "string", description: "Radio product ID" },
        body: { type: "object", description: "Updated radio product data" },
      },
      required: ["radio_product_id", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "PUT",
        path: `/1/radios/${args.radio_product_id}`,
        body: args.body as Record<string, unknown>,
      }),
  },

  // ─── Radio Product Options (1) ──────────────────────────────────────────────
  {
    name: "list_radio_options",
    description: "List radio product options",
    inputSchema: {
      type: "object",
      properties: {
        radio_product_id: { type: "string", description: "Radio product ID" },
      },
      required: ["radio_product_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/radios/${args.radio_product_id}/options`,
      }),
  },

  // ─── Notifications (2) ───────────────────────────────────────────────────────
  {
    name: "get_radio_notification",
    description: "Get radio product notification settings",
    inputSchema: {
      type: "object",
      properties: {
        radio_product_id: { type: "string", description: "Radio product ID" },
      },
      required: ["radio_product_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/radios/${args.radio_product_id}/notification`,
      }),
  },
  {
    name: "update_radio_notification",
    description: "Update notification settings for a radio product",
    inputSchema: {
      type: "object",
      properties: {
        radio_product_id: { type: "string", description: "Radio product ID" },
        body: { type: "object", description: "Notification settings data" },
      },
      required: ["radio_product_id", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "PUT",
        path: `/1/radios/${args.radio_product_id}/notification`,
        body: args.body as Record<string, unknown>,
      }),
  },

  // ─── Stations (4) ───────────────────────────────────────────────────────────
  {
    name: "list_radio_stations",
    description: "List stations for a radio product",
    inputSchema: {
      type: "object",
      properties: {
        radio_product_id: { type: "string", description: "Radio product ID" },
      },
      required: ["radio_product_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/radios/${args.radio_product_id}/stations`,
      }),
  },
  {
    name: "create_radio_station",
    description: "Create a new station for a radio product",
    inputSchema: {
      type: "object",
      properties: {
        radio_product_id: { type: "string", description: "Radio product ID" },
        body: { type: "object", description: "Station data" },
      },
      required: ["radio_product_id", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/1/radios/${args.radio_product_id}/stations`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "update_radio_station",
    description: "Update a station",
    inputSchema: {
      type: "object",
      properties: {
        radio_product_id: { type: "string", description: "Radio product ID" },
        station_id: { type: "string", description: "Station ID" },
        body: { type: "object", description: "Updated station data" },
      },
      required: ["radio_product_id", "station_id", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "PUT",
        path: `/1/radios/${args.radio_product_id}/stations/${args.station_id}`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "delete_radio_station",
    description: "Delete a station",
    inputSchema: {
      type: "object",
      properties: {
        radio_product_id: { type: "string", description: "Radio product ID" },
        station_id: { type: "string", description: "Station ID" },
      },
      required: ["radio_product_id", "station_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "DELETE",
        path: `/1/radios/${args.radio_product_id}/stations/${args.station_id}`,
      }),
  },

  // ─── AutoDJ — General (1) ───────────────────────────────────────────────────
  {
    name: "get_radio_autodj",
    description: "Get AutoDJ configuration for a station",
    inputSchema: {
      type: "object",
      properties: {
        radio_product_id: { type: "string", description: "Radio product ID" },
        station_id: { type: "string", description: "Station ID" },
      },
      required: ["radio_product_id", "station_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/radios/${args.radio_product_id}/stations/${args.station_id}/autodj`,
      }),
  },

  // ─── AutoDJ — Playlists (2) ────────────────────────────────────────────────
  {
    name: "list_radio_autodj_playlists",
    description: "List AutoDJ playlists for a station",
    inputSchema: {
      type: "object",
      properties: {
        radio_product_id: { type: "string", description: "Radio product ID" },
        station_id: { type: "string", description: "Station ID" },
      },
      required: ["radio_product_id", "station_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/radios/${args.radio_product_id}/stations/${args.station_id}/autodj/playlists`,
      }),
  },
  {
    name: "create_radio_autodj_playlist",
    description: "Create a new AutoDJ playlist for a station",
    inputSchema: {
      type: "object",
      properties: {
        radio_product_id: { type: "string", description: "Radio product ID" },
        station_id: { type: "string", description: "Station ID" },
        body: { type: "object", description: "Playlist data" },
      },
      required: ["radio_product_id", "station_id", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/1/radios/${args.radio_product_id}/stations/${args.station_id}/autodj/playlists`,
        body: args.body as Record<string, unknown>,
      }),
  },

  // ─── AutoDJ — Playing Playlist (3) ──────────────────────────────────────────
  {
    name: "get_radio_autodj_playing_playlist",
    description: "Get the currently playing playlist for a station",
    inputSchema: {
      type: "object",
      properties: {
        radio_product_id: { type: "string", description: "Radio product ID" },
        station_id: { type: "string", description: "Station ID" },
      },
      required: ["radio_product_id", "station_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/radios/${args.radio_product_id}/stations/${args.station_id}/autodj/playing_playlist`,
      }),
  },
  {
    name: "list_radio_autodj_playing_medias",
    description: "List medias in the currently playing playlist",
    inputSchema: {
      type: "object",
      properties: {
        radio_product_id: { type: "string", description: "Radio product ID" },
        station_id: { type: "string", description: "Station ID" },
      },
      required: ["radio_product_id", "station_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/radios/${args.radio_product_id}/stations/${args.station_id}/autodj/playing_playlist/medias`,
      }),
  },
  {
    name: "delete_radio_autodj_playing_media",
    description: "Delete a media from the playing playlist",
    inputSchema: {
      type: "object",
      properties: {
        radio_product_id: { type: "string", description: "Radio product ID" },
        station_id: { type: "string", description: "Station ID" },
        playing_media_id: { type: "string", description: "Playing media ID" },
      },
      required: ["radio_product_id", "station_id", "playing_media_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "DELETE",
        path: `/1/radios/${args.radio_product_id}/stations/${args.station_id}/autodj/playing_playlist/medias/${args.playing_media_id}`,
      }),
  },
  {
    name: "move_radio_autodj_playing_media",
    description: "Move a media after another in the playing playlist",
    inputSchema: {
      type: "object",
      properties: {
        radio_product_id: { type: "string", description: "Radio product ID" },
        station_id: { type: "string", description: "Station ID" },
        playing_media_id: { type: "string", description: "Playing media ID to move" },
        body: { type: "object", description: "Move data (e.g. after_media_id)" },
      },
      required: ["radio_product_id", "station_id", "playing_media_id", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/1/radios/${args.radio_product_id}/stations/${args.station_id}/autodj/playing_playlist/medias/${args.playing_media_id}/move`,
        body: args.body as Record<string, unknown>,
      }),
  },

  // ─── AutoDJ — Advanced Playlists (2) ────────────────────────────────────────
  {
    name: "list_radio_autodj_advanced_playlist_steps",
    description: "List steps of an advanced playlist (mixtape)",
    inputSchema: {
      type: "object",
      properties: {
        radio_product_id: { type: "string", description: "Radio product ID" },
        station_id: { type: "string", description: "Station ID" },
        vod_mixtape_id: { type: "string", description: "VOD mixtape (advanced playlist) ID" },
      },
      required: ["radio_product_id", "station_id", "vod_mixtape_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/radios/${args.radio_product_id}/stations/${args.station_id}/autodj/advanced_playlists/${args.vod_mixtape_id}/steps`,
      }),
  },
  {
    name: "sync_radio_autodj_advanced_playlist_steps",
    description: "Sync steps of an advanced playlist (mixtape)",
    inputSchema: {
      type: "object",
      properties: {
        radio_product_id: { type: "string", description: "Radio product ID" },
        station_id: { type: "string", description: "Station ID" },
        vod_mixtape_id: { type: "string", description: "VOD mixtape (advanced playlist) ID" },
        body: { type: "object", description: "Sync data" },
      },
      required: ["radio_product_id", "station_id", "vod_mixtape_id", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/1/radios/${args.radio_product_id}/stations/${args.station_id}/autodj/advanced_playlists/${args.vod_mixtape_id}/steps/sync`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "delete_radio_autodj_advanced_playlist_steps",
    description: "Delete all steps of an advanced playlist (mixtape)",
    inputSchema: {
      type: "object",
      properties: {
        radio_product_id: { type: "string", description: "Radio product ID" },
        station_id: { type: "string", description: "Station ID" },
        vod_mixtape_id: { type: "string", description: "VOD mixtape (advanced playlist) ID" },
      },
      required: ["radio_product_id", "station_id", "vod_mixtape_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "DELETE",
        path: `/1/radios/${args.radio_product_id}/stations/${args.station_id}/autodj/advanced_playlists/${args.vod_mixtape_id}/steps`,
      }),
  },

  // ─── Streams (5) ────────────────────────────────────────────────────────────
  {
    name: "list_radio_streams",
    description: "List streams for a station",
    inputSchema: {
      type: "object",
      properties: {
        radio_product_id: { type: "string", description: "Radio product ID" },
        station_id: { type: "string", description: "Station ID" },
      },
      required: ["radio_product_id", "station_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/radios/${args.radio_product_id}/stations/${args.station_id}/streams`,
      }),
  },
  {
    name: "create_radio_stream",
    description: "Create a new stream for a station",
    inputSchema: {
      type: "object",
      properties: {
        radio_product_id: { type: "string", description: "Radio product ID" },
        station_id: { type: "string", description: "Station ID" },
        body: { type: "object", description: "Stream data" },
      },
      required: ["radio_product_id", "station_id", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/1/radios/${args.radio_product_id}/stations/${args.station_id}/streams`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "get_radio_stream",
    description: "Get a specific stream",
    inputSchema: {
      type: "object",
      properties: {
        radio_product_id: { type: "string", description: "Radio product ID" },
        station_id: { type: "string", description: "Station ID" },
        stream_id: { type: "string", description: "Stream ID" },
      },
      required: ["radio_product_id", "station_id", "stream_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/radios/${args.radio_product_id}/stations/${args.station_id}/streams/${args.stream_id}`,
      }),
  },
  {
    name: "update_radio_stream",
    description: "Update a stream",
    inputSchema: {
      type: "object",
      properties: {
        radio_product_id: { type: "string", description: "Radio product ID" },
        station_id: { type: "string", description: "Station ID" },
        stream_id: { type: "string", description: "Stream ID" },
        body: { type: "object", description: "Updated stream data" },
      },
      required: ["radio_product_id", "station_id", "stream_id", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "PUT",
        path: `/1/radios/${args.radio_product_id}/stations/${args.station_id}/streams/${args.stream_id}`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "delete_radio_stream",
    description: "Delete a stream",
    inputSchema: {
      type: "object",
      properties: {
        radio_product_id: { type: "string", description: "Radio product ID" },
        station_id: { type: "string", description: "Station ID" },
        stream_id: { type: "string", description: "Stream ID" },
      },
      required: ["radio_product_id", "station_id", "stream_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "DELETE",
        path: `/1/radios/${args.radio_product_id}/stations/${args.station_id}/streams/${args.stream_id}`,
      }),
  },

  // ─── HLS Stream (1) ─────────────────────────────────────────────────────────
  {
    name: "get_radio_hls_stream",
    description: "Get HLS stream configuration for a station",
    inputSchema: {
      type: "object",
      properties: {
        radio_product_id: { type: "string", description: "Radio product ID" },
        station_id: { type: "string", description: "Station ID" },
      },
      required: ["radio_product_id", "station_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/radios/${args.radio_product_id}/stations/${args.station_id}/hls_stream`,
      }),
  },

  // ─── Players (4) ────────────────────────────────────────────────────────────
  {
    name: "list_radio_players",
    description: "List players for a radio product",
    inputSchema: {
      type: "object",
      properties: {
        radio_product_id: { type: "string", description: "Radio product ID" },
      },
      required: ["radio_product_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/radios/${args.radio_product_id}/players`,
      }),
  },
  {
    name: "create_radio_player",
    description: "Create a new player for a radio product",
    inputSchema: {
      type: "object",
      properties: {
        radio_product_id: { type: "string", description: "Radio product ID" },
        body: { type: "object", description: "Player data" },
      },
      required: ["radio_product_id", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/1/radios/${args.radio_product_id}/players`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "get_radio_player",
    description: "Get a specific player",
    inputSchema: {
      type: "object",
      properties: {
        radio_product_id: { type: "string", description: "Radio product ID" },
        player_id: { type: "string", description: "Player ID" },
      },
      required: ["radio_product_id", "player_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/radios/${args.radio_product_id}/players/${args.player_id}`,
      }),
  },
  {
    name: "delete_radio_player",
    description: "Delete a player",
    inputSchema: {
      type: "object",
      properties: {
        radio_product_id: { type: "string", description: "Radio product ID" },
        player_id: { type: "string", description: "Player ID" },
      },
      required: ["radio_product_id", "player_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "DELETE",
        path: `/1/radios/${args.radio_product_id}/players/${args.player_id}`,
      }),
  },
];
