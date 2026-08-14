/**
 * AI module — 16 tools for AI API access, models, chat, embeddings, and more.
 */

import { apiCall } from "../client.js";
import type { ToolDef } from "../types.js";

export const aiTools: ToolDef[] = [
  {
    name: "list_ai_apis",
    description: "List available AI APIs",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async () =>
      apiCall({
        method: "GET",
        path: "/1/ai",
      }),
  },
  {
    name: "list_ai_consumptions",
    description: "List AI consumptions for a product",
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
        path: `/1/ai/${args.product_id}/consumptions`,
      }),
  },
  {
    name: "list_ai_models_legacy",
    description: "List AI models (legacy endpoint)",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async () =>
      apiCall({
        method: "GET",
        path: "/1/ai/models",
      }),
  },
  {
    name: "list_ai_models",
    description: "List AI models for a product (v2)",
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
        path: `/2/ai/${args.product_id}/openai/v1/models`,
      }),
  },
  {
    name: "list_ai_models_deprecated",
    description: "List AI models for a product (deprecated)",
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
        path: `/1/ai/${args.product_id}/openai/models`,
      }),
  },
  {
    name: "create_chat_completion",
    description: "Create a chat completion (OpenAI v2 format)",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID" },
        body: { type: "object", description: "OpenAI chat completion request body" },
      },
      required: ["product_id", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/2/ai/${args.product_id}/openai/v1/chat/completions`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "create_completion",
    description: "Create a text completion",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID" },
        body: { type: "object", description: "Completion request body" },
      },
      required: ["product_id", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/2/ai/${args.product_id}/openai/v1/completions`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "create_embeddings",
    description: "Create embeddings",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID" },
        body: { type: "object", description: "Embeddings request body" },
      },
      required: ["product_id", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/2/ai/${args.product_id}/openai/v1/embeddings`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "create_rerank",
    description: "Create a rerank using Cohere v2",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID" },
        body: { type: "object", description: "Rerank request body" },
      },
      required: ["product_id", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/2/ai/${args.product_id}/cohere/v2/rerank`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "create_chat_completion_deprecated",
    description: "Create a chat completion (deprecated endpoint)",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID" },
        body: { type: "object", description: "Chat completion request body" },
      },
      required: ["product_id", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/1/ai/${args.product_id}/openai/chat/completions`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "create_transcription",
    description: "Create a transcription from audio",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID" },
        body: { type: "object", description: "Transcription request body" },
      },
      required: ["product_id", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/1/ai/${args.product_id}/openai/audio/transcriptions`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "create_image",
    description: "Generate an image",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID" },
        body: { type: "object", description: "Image generation request body" },
      },
      required: ["product_id", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/1/ai/${args.product_id}/openai/images/generations`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "create_embeddings_deprecated",
    description: "Create embeddings (deprecated endpoint)",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID" },
        body: { type: "object", description: "Embeddings request body" },
      },
      required: ["product_id", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/1/ai/${args.product_id}/openai/v1/embeddings`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "create_photo_maker",
    description: "Create a photo maker image",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID" },
        body: { type: "object", description: "Photo maker request body" },
      },
      required: ["product_id", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/1/ai/${args.product_id}/images/generations/photo_maker`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "get_batch_result",
    description: "Get batch job result",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID" },
        batch_id: { type: "string", description: "Batch job ID" },
      },
      required: ["product_id", "batch_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/ai/${args.product_id}/results/${args.batch_id}`,
      }),
  },
  {
    name: "download_batch_result",
    description: "Download batch job result",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID" },
        batch_id: { type: "string", description: "Batch job ID" },
      },
      required: ["product_id", "batch_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/ai/${args.product_id}/results/${args.batch_id}/download`,
      }),
  },
];
