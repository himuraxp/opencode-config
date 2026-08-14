/**
 * Newsletter module — 38 tools for campaigns, subscribers, groups, segments, fields, templates, webforms, dashboard & credits.
 */

import { apiCall } from "../client.js";
import type { ToolDef } from "../types.js";

// ─── Campaigns (14) ─────────────────────────────────────────────────────────

export const campaignTools: ToolDef[] = [
  {
    name: "list_campaigns",
    description: "List newsletter campaigns",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
      },
      required: ["domain"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/campaigns`,
      }),
  },
  {
    name: "create_campaign",
    description: "Create a newsletter campaign",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        body: { type: "object", description: "Campaign data" },
      },
      required: ["domain", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/1/newsletters/${args.domain}/campaigns`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "delete_campaigns_bulk",
    description: "Delete multiple campaigns in bulk",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
      },
      required: ["domain"],
    },
    handler: async (args) =>
      apiCall({
        method: "DELETE",
        path: `/1/newsletters/${args.domain}/campaigns`,
      }),
  },
  {
    name: "get_campaign",
    description: "Get a specific campaign",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        campaign: { type: "string", description: "Campaign ID" },
      },
      required: ["domain", "campaign"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/campaigns/${args.campaign}`,
      }),
  },
  {
    name: "update_campaign",
    description: "Update a campaign",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        campaign: { type: "string", description: "Campaign ID" },
        body: { type: "object", description: "Updated campaign data" },
      },
      required: ["domain", "campaign", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "PUT",
        path: `/1/newsletters/${args.domain}/campaigns/${args.campaign}`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "delete_campaign",
    description: "Delete a specific campaign",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        campaign: { type: "string", description: "Campaign ID" },
      },
      required: ["domain", "campaign"],
    },
    handler: async (args) =>
      apiCall({
        method: "DELETE",
        path: `/1/newsletters/${args.domain}/campaigns/${args.campaign}`,
      }),
  },
  {
    name: "get_campaign_tracking",
    description: "Get campaign tracking data",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        campaign: { type: "string", description: "Campaign ID" },
      },
      required: ["domain", "campaign"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/campaigns/${args.campaign}/tracking`,
      }),
  },
  {
    name: "get_campaign_links_activity",
    description: "Get campaign links activity report",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        campaign: { type: "string", description: "Campaign ID" },
      },
      required: ["domain", "campaign"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/campaigns/${args.campaign}/report/links`,
      }),
  },
  {
    name: "get_campaign_subscribers_activity",
    description: "Get campaign subscribers activity report",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        campaign: { type: "string", description: "Campaign ID" },
      },
      required: ["domain", "campaign"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/campaigns/${args.campaign}/report/activity`,
      }),
  },
  {
    name: "duplicate_campaign",
    description: "Duplicate a campaign",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        campaign: { type: "string", description: "Campaign ID" },
      },
      required: ["domain", "campaign"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/1/newsletters/${args.domain}/campaigns/${args.campaign}/duplicate`,
      }),
  },
  {
    name: "test_campaign",
    description: "Send a test campaign",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        campaign: { type: "string", description: "Campaign ID" },
      },
      required: ["domain", "campaign"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/1/newsletters/${args.domain}/campaigns/${args.campaign}/test`,
      }),
  },
  {
    name: "cancel_campaign",
    description: "Cancel a scheduled campaign",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        campaign: { type: "string", description: "Campaign ID" },
      },
      required: ["domain", "campaign"],
    },
    handler: async (args) =>
      apiCall({
        method: "PUT",
        path: `/1/newsletters/${args.domain}/campaigns/${args.campaign}/cancel`,
      }),
  },
  {
    name: "schedule_campaign",
    description: "Schedule a campaign",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        campaign: { type: "string", description: "Campaign ID" },
        body: { type: "object", description: "Schedule data" },
      },
      required: ["domain", "campaign", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "PUT",
        path: `/1/newsletters/${args.domain}/campaigns/${args.campaign}/schedule`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "test_template_campaign",
    description: "Test a template as a campaign",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        template_uuid: { type: "string", description: "Template UUID" },
        body: { type: "object", description: "Test campaign data" },
      },
      required: ["domain", "template_uuid", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/1/newsletters/${args.domain}/campaigns/template/${args.template_uuid}/test`,
        body: args.body as Record<string, unknown>,
      }),
  },
];

// ─── Subscribers (13) ───────────────────────────────────────────────────────

export const subscriberTools: ToolDef[] = [
  {
    name: "list_subscribers",
    description: "List newsletter subscribers",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
      },
      required: ["domain"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/subscribers`,
      }),
  },
  {
    name: "create_subscriber",
    description: "Create a subscriber",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        body: { type: "object", description: "Subscriber data" },
      },
      required: ["domain", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/1/newsletters/${args.domain}/subscribers`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "delete_subscribers_bulk",
    description: "Delete multiple subscribers in bulk",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
      },
      required: ["domain"],
    },
    handler: async (args) =>
      apiCall({
        method: "DELETE",
        path: `/1/newsletters/${args.domain}/subscribers`,
      }),
  },
  {
    name: "count_subscribers_status",
    description: "Count subscribers by status",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
      },
      required: ["domain"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/subscribers/count_status`,
      }),
  },
  {
    name: "get_subscriber",
    description: "Get a specific subscriber",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        subscriber: { type: "string", description: "Subscriber ID" },
      },
      required: ["domain", "subscriber"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/subscribers/${args.subscriber}`,
      }),
  },
  {
    name: "update_subscriber",
    description: "Update a subscriber",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        subscriber: { type: "string", description: "Subscriber ID" },
        body: { type: "object", description: "Updated subscriber data" },
      },
      required: ["domain", "subscriber", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "PUT",
        path: `/1/newsletters/${args.domain}/subscribers/${args.subscriber}`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "delete_subscriber",
    description: "Delete a subscriber",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        subscriber: { type: "string", description: "Subscriber ID" },
      },
      required: ["domain", "subscriber"],
    },
    handler: async (args) =>
      apiCall({
        method: "DELETE",
        path: `/1/newsletters/${args.domain}/subscribers/${args.subscriber}`,
      }),
  },
  {
    name: "forget_subscriber",
    description: "Forget a subscriber (GDPR compliance)",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        subscriber: { type: "string", description: "Subscriber ID" },
      },
      required: ["domain", "subscriber"],
    },
    handler: async (args) =>
      apiCall({
        method: "DELETE",
        path: `/1/newsletters/${args.domain}/subscribers/${args.subscriber}/forget`,
      }),
  },
  {
    name: "filter_subscribers",
    description: "Filter subscribers",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        body: { type: "object", description: "Filter criteria" },
      },
      required: ["domain", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/1/newsletters/${args.domain}/subscribers/filter`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "export_subscribers",
    description: "Export subscribers",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        body: { type: "object", description: "Export options" },
      },
      required: ["domain", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/1/newsletters/${args.domain}/subscribers/export`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "import_subscribers",
    description: "Import subscribers",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        body: { type: "object", description: "Import data" },
      },
      required: ["domain", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/1/newsletters/${args.domain}/subscribers/import`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "upload_csv",
    description: "Upload CSV for subscriber import",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        body: { type: "object", description: "CSV upload data" },
      },
      required: ["domain", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/1/newsletters/${args.domain}/subscribers/import/upload`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "list_addressbook",
    description: "List addressbooks for subscriber import",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
      },
      required: ["domain"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/subscribers/import/workspace`,
      }),
  },
];

// ─── Groups (7) ─────────────────────────────────────────────────────────────

export const groupTools: ToolDef[] = [
  {
    name: "list_groups",
    description: "List subscriber groups",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
      },
      required: ["domain"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/groups`,
      }),
  },
  {
    name: "create_group",
    description: "Create a subscriber group",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        body: { type: "object", description: "Group data" },
      },
      required: ["domain", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/1/newsletters/${args.domain}/groups`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "delete_groups_bulk",
    description: "Delete multiple groups in bulk",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
      },
      required: ["domain"],
    },
    handler: async (args) =>
      apiCall({
        method: "DELETE",
        path: `/1/newsletters/${args.domain}/groups`,
      }),
  },
  {
    name: "get_group",
    description: "Get a specific group",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        group: { type: "string", description: "Group ID" },
      },
      required: ["domain", "group"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/groups/${args.group}`,
      }),
  },
  {
    name: "update_group",
    description: "Update a group",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        group: { type: "string", description: "Group ID" },
        body: { type: "object", description: "Updated group data" },
      },
      required: ["domain", "group", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "PUT",
        path: `/1/newsletters/${args.domain}/groups/${args.group}`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "delete_group",
    description: "Delete a group",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        group: { type: "string", description: "Group ID" },
      },
      required: ["domain", "group"],
    },
    handler: async (args) =>
      apiCall({
        method: "DELETE",
        path: `/1/newsletters/${args.domain}/groups/${args.group}`,
      }),
  },
  {
    name: "list_group_subscribers",
    description: "List subscribers in a group",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        group: { type: "string", description: "Group ID" },
      },
      required: ["domain", "group"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/groups/${args.group}/subscribers`,
      }),
  },
];

// ─── Segments (6) ───────────────────────────────────────────────────────────

export const segmentTools: ToolDef[] = [
  {
    name: "list_segments",
    description: "List subscriber segments",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
      },
      required: ["domain"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/segments`,
      }),
  },
  {
    name: "create_segment",
    description: "Create a subscriber segment",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        body: { type: "object", description: "Segment data" },
      },
      required: ["domain", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/1/newsletters/${args.domain}/segments`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "delete_segments_bulk",
    description: "Delete multiple segments in bulk",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
      },
      required: ["domain"],
    },
    handler: async (args) =>
      apiCall({
        method: "DELETE",
        path: `/1/newsletters/${args.domain}/segments`,
      }),
  },
  {
    name: "get_segment",
    description: "Get a specific segment",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        segment: { type: "string", description: "Segment ID" },
      },
      required: ["domain", "segment"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/segments/${args.segment}`,
      }),
  },
  {
    name: "update_segment",
    description: "Update a segment",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        segment: { type: "string", description: "Segment ID" },
        body: { type: "object", description: "Updated segment data" },
      },
      required: ["domain", "segment", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "PUT",
        path: `/1/newsletters/${args.domain}/segments/${args.segment}`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "delete_segment",
    description: "Delete a segment",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        segment: { type: "string", description: "Segment ID" },
      },
      required: ["domain", "segment"],
    },
    handler: async (args) =>
      apiCall({
        method: "DELETE",
        path: `/1/newsletters/${args.domain}/segments/${args.segment}`,
      }),
  },
];

// ─── Fields (5) ─────────────────────────────────────────────────────────────

export const fieldTools: ToolDef[] = [
  {
    name: "list_fields",
    description: "List subscriber fields",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
      },
      required: ["domain"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/fields`,
      }),
  },
  {
    name: "create_field",
    description: "Create a subscriber field",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        body: { type: "object", description: "Field data" },
      },
      required: ["domain", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/1/newsletters/${args.domain}/fields`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "delete_fields_bulk",
    description: "Delete multiple fields in bulk",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
      },
      required: ["domain"],
    },
    handler: async (args) =>
      apiCall({
        method: "DELETE",
        path: `/1/newsletters/${args.domain}/fields`,
      }),
  },
  {
    name: "update_field",
    description: "Update a field",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        field: { type: "string", description: "Field ID" },
        body: { type: "object", description: "Updated field data" },
      },
      required: ["domain", "field", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "PUT",
        path: `/1/newsletters/${args.domain}/fields/${args.field}`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "delete_field",
    description: "Delete a field",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        field: { type: "string", description: "Field ID" },
      },
      required: ["domain", "field"],
    },
    handler: async (args) =>
      apiCall({
        method: "DELETE",
        path: `/1/newsletters/${args.domain}/fields/${args.field}`,
      }),
  },
];

// ─── Templates (3) ──────────────────────────────────────────────────────────

export const templateTools: ToolDef[] = [
  {
    name: "list_templates",
    description: "List newsletter templates",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
      },
      required: ["domain"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/templates`,
      }),
  },
  {
    name: "get_template_html",
    description: "Get template HTML content",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        template: { type: "string", description: "Template ID" },
      },
      required: ["domain", "template"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/templates/${args.template}/html`,
      }),
  },
  {
    name: "update_thumbnail",
    description: "Update template thumbnail",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        template: { type: "string", description: "Template ID" },
      },
      required: ["domain", "template"],
    },
    handler: async (args) =>
      apiCall({
        method: "PUT",
        path: `/1/newsletters/${args.domain}/templates/${args.template}/update-thumbnails`,
      }),
  },
];

// ─── Webforms (8) ───────────────────────────────────────────────────────────

export const webformTools: ToolDef[] = [
  {
    name: "list_webforms",
    description: "List newsletter webforms",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
      },
      required: ["domain"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/webforms`,
      }),
  },
  {
    name: "create_webform",
    description: "Create a webform",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        body: { type: "object", description: "Webform data" },
      },
      required: ["domain", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/1/newsletters/${args.domain}/webforms`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "delete_webforms_bulk",
    description: "Delete multiple webforms in bulk",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
      },
      required: ["domain"],
    },
    handler: async (args) =>
      apiCall({
        method: "DELETE",
        path: `/1/newsletters/${args.domain}/webforms`,
      }),
  },
  {
    name: "list_webform_themes",
    description: "List webform themes",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
      },
      required: ["domain"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/webforms/themes`,
      }),
  },
  {
    name: "get_webform",
    description: "Get a specific webform",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        webform: { type: "string", description: "Webform ID" },
      },
      required: ["domain", "webform"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/webforms/${args.webform}`,
      }),
  },
  {
    name: "update_webform",
    description: "Update a webform",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        webform: { type: "string", description: "Webform ID" },
        body: { type: "object", description: "Updated webform data" },
      },
      required: ["domain", "webform", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "PUT",
        path: `/1/newsletters/${args.domain}/webforms/${args.webform}`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "delete_webform",
    description: "Delete a webform",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        webform: { type: "string", description: "Webform ID" },
      },
      required: ["domain", "webform"],
    },
    handler: async (args) =>
      apiCall({
        method: "DELETE",
        path: `/1/newsletters/${args.domain}/webforms/${args.webform}`,
      }),
  },
  {
    name: "list_webform_fields",
    description: "List webform fields",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
        webform: { type: "string", description: "Webform ID" },
      },
      required: ["domain", "webform"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/webforms/${args.webform}/fields`,
      }),
  },
];

// ─── Dashboard & Credits (13) ───────────────────────────────────────────────

export const dashboardTools: ToolDef[] = [
  {
    name: "get_newsletter_dashboard",
    description: "Get newsletter dashboard",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
      },
      required: ["domain"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/dashboard`,
      }),
  },
  {
    name: "list_dashboard_campaigns",
    description: "List dashboard campaigns",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
      },
      required: ["domain"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/dashboard/campaigns`,
      }),
  },
  {
    name: "get_dashboard_subscriber_stats",
    description: "Get dashboard subscriber statistics",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
      },
      required: ["domain"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/dashboard/stats/subscribers`,
      }),
  },
  {
    name: "get_dashboard_campaign_stats",
    description: "Get dashboard campaign statistics",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
      },
      required: ["domain"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/dashboard/stats/campaigns`,
      }),
  },
  {
    name: "get_monthly_campaign_stats",
    description: "Get monthly campaign statistics",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
      },
      required: ["domain"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/dashboard/stats/campaigns/monthly`,
      }),
  },
  {
    name: "get_newsletter_domain",
    description: "Get newsletter domain info",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
      },
      required: ["domain"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}`,
      }),
  },
  {
    name: "delete_newsletter_domain",
    description: "Delete newsletter domain",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
      },
      required: ["domain"],
    },
    handler: async (args) =>
      apiCall({
        method: "DELETE",
        path: `/1/newsletters/${args.domain}`,
      }),
  },
  {
    name: "list_credits",
    description: "List newsletter credits",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
      },
      required: ["domain"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/credits`,
      }),
  },
  {
    name: "get_credits_accounts",
    description: "Get credits accounts",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
      },
      required: ["domain"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/credits/accounts`,
      }),
  },
  {
    name: "get_credits_details",
    description: "Get credits details",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
      },
      required: ["domain"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/credits/details`,
      }),
  },
  {
    name: "list_credits_offers",
    description: "List credits offers",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Newsletter domain" },
      },
      required: ["domain"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/newsletters/${args.domain}/credits/packs`,
      }),
  },
];

// ─── Export all newsletter tools ────────────────────────────────────────────

export const newsletterTools: ToolDef[] = [
  ...campaignTools,
  ...subscriberTools,
  ...groupTools,
  ...segmentTools,
  ...fieldTools,
  ...templateTools,
  ...webformTools,
  ...dashboardTools,
];
