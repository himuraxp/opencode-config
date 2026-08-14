/**
 * Core module — 38 tools for Events, Profile, App Passwords, Accounts, Teams, kSuite & Mailbox, Misc.
 */

import { apiCall } from "../client.js";
import type { ToolDef } from "../types.js";

// ─── Events (3) ─────────────────────────────────────────────────────────────

export const eventTools: ToolDef[] = [
  {
    name: "list_events",
    description: "List events with optional date filtering and pagination",
    inputSchema: {
      type: "object",
      properties: {
        date_from: { type: "string", description: "Filter events from this date (ISO 8601)" },
        date_to: { type: "string", description: "Filter events until this date (ISO 8601)" },
        page: { type: "number", description: "Page number for pagination" },
        per_page: { type: "number", description: "Number of items per page" },
      },
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: "/2/events",
        params: args as Record<string, string | number | boolean | undefined>,
      }),
  },
  {
    name: "get_event",
    description: "Get a specific event by ID",
    inputSchema: {
      type: "object",
      properties: {
        event_id: { type: "string", description: "Event ID" },
      },
      required: ["event_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/2/events/${args.event_id}`,
      }),
  },
  {
    name: "get_public_cloud_status",
    description: "Get public cloud status",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async () =>
      apiCall({
        method: "GET",
        path: "/2/events/public-cloud-status",
      }),
  },
];

// ─── Profile (10) ───────────────────────────────────────────────────────────

export const profileTools: ToolDef[] = [
  {
    name: "get_profile",
    description: "Get current user profile",
    inputSchema: {
      type: "object",
      properties: {
        with: { type: "string", description: "Include related data" },
      },
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: "/2/profile",
        params: args as Record<string, string | number | boolean | undefined>,
      }),
  },
  {
    name: "update_profile",
    description: "Update current user profile (partial update)",
    inputSchema: {
      type: "object",
      properties: {
        body: { type: "object", description: "Partial profile data to update" },
      },
      required: ["body"],
    },
    handler: async (args) =>
      apiCall({
        method: "PATCH",
        path: "/2/profile",
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "update_avatar",
    description: "Update user avatar",
    inputSchema: {
      type: "object",
      properties: {
        body: { type: "object", description: "Avatar data" },
      },
      required: ["body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: "/2/profile/avatar",
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "delete_avatar",
    description: "Delete user avatar",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async () =>
      apiCall({
        method: "DELETE",
        path: "/2/profile/avatar",
      }),
  },
  {
    name: "list_phones",
    description: "List user phones",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async () =>
      apiCall({
        method: "GET",
        path: "/2/profile/phones",
      }),
  },
  {
    name: "get_phone",
    description: "Get a specific phone by ID",
    inputSchema: {
      type: "object",
      properties: {
        phone_id: { type: "string", description: "Phone ID" },
      },
      required: ["phone_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/2/profile/phones/${args.phone_id}`,
      }),
  },
  {
    name: "delete_phone",
    description: "Delete a phone by ID",
    inputSchema: {
      type: "object",
      properties: {
        phone_id: { type: "string", description: "Phone ID" },
      },
      required: ["phone_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "DELETE",
        path: `/2/profile/phones/${args.phone_id}`,
      }),
  },
  {
    name: "list_emails",
    description: "List user emails",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async () =>
      apiCall({
        method: "GET",
        path: "/2/profile/emails",
      }),
  },
  {
    name: "get_email",
    description: "Get a specific email by type and ID",
    inputSchema: {
      type: "object",
      properties: {
        email_type: { type: "string", description: "Email type" },
        email_id: { type: "string", description: "Email ID" },
      },
      required: ["email_type", "email_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/2/profile/emails/${args.email_type}/${args.email_id}`,
      }),
  },
  {
    name: "delete_email",
    description: "Delete an email by type and ID",
    inputSchema: {
      type: "object",
      properties: {
        email_type: { type: "string", description: "Email type" },
        email_id: { type: "string", description: "Email ID" },
      },
      required: ["email_type", "email_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "DELETE",
        path: `/2/profile/emails/${args.email_type}/${args.email_id}`,
      }),
  },
];

// ─── App Passwords (3) ──────────────────────────────────────────────────────

export const appPasswordTools: ToolDef[] = [
  {
    name: "list_app_passwords",
    description: "List application passwords",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async () =>
      apiCall({
        method: "GET",
        path: "/2/profile/applications/passwords",
      }),
  },
  {
    name: "create_app_password",
    description: "Create a new application password",
    inputSchema: {
      type: "object",
      properties: {
        body: { type: "object", description: "Password data with name" },
      },
      required: ["body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: "/2/profile/applications/passwords",
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "get_app_password",
    description: "Get a specific app password by ID",
    inputSchema: {
      type: "object",
      properties: {
        password_id: { type: "string", description: "Password ID" },
      },
      required: ["password_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/2/profile/applications/passwords/${args.password_id}`,
      }),
  },
];

// ─── Accounts (12) ──────────────────────────────────────────────────────────

export const accountTools: ToolDef[] = [
  {
    name: "list_accounts",
    description: "List accounts with pagination",
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
        path: "/1/accounts",
        params: args as Record<string, string | number | boolean | undefined>,
      }),
  },
  {
    name: "get_account",
    description: "Get a specific account by ID",
    inputSchema: {
      type: "object",
      properties: {
        account_id: { type: "string", description: "Account ID" },
      },
      required: ["account_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/accounts/${args.account_id}`,
      }),
  },
  {
    name: "list_account_products",
    description: "List products for a specific account",
    inputSchema: {
      type: "object",
      properties: {
        account_id: { type: "string", description: "Account ID" },
      },
      required: ["account_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/accounts/${args.account_id}/products`,
      }),
  },
  {
    name: "list_account_services",
    description: "List services for a specific account",
    inputSchema: {
      type: "object",
      properties: {
        account_id: { type: "string", description: "Account ID" },
      },
      required: ["account_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/accounts/${args.account_id}/services`,
      }),
  },
  {
    name: "list_current_account_products",
    description: "List products for the current account",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async () =>
      apiCall({
        method: "GET",
        path: "/1/accounts/current/products",
      }),
  },
  {
    name: "list_basic_teams",
    description: "List basic teams for an account",
    inputSchema: {
      type: "object",
      properties: {
        account_id: { type: "string", description: "Account ID" },
      },
      required: ["account_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/accounts/${args.account_id}/basic/teams`,
      }),
  },
  {
    name: "list_account_tags",
    description: "List tags for an account",
    inputSchema: {
      type: "object",
      properties: {
        account: { type: "string", description: "Account identifier" },
      },
      required: ["account"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/accounts/${args.account}/tags`,
      }),
  },
  {
    name: "create_tag",
    description: "Create a tag for an account",
    inputSchema: {
      type: "object",
      properties: {
        account: { type: "string", description: "Account identifier" },
        body: { type: "object", description: "Tag data with name" },
      },
      required: ["account", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/1/accounts/${args.account}/tags`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "update_tag",
    description: "Update a tag for an account",
    inputSchema: {
      type: "object",
      properties: {
        account: { type: "string", description: "Account identifier" },
        tag: { type: "string", description: "Tag identifier" },
        body: { type: "object", description: "Updated tag data" },
      },
      required: ["account", "tag", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "PUT",
        path: `/1/accounts/${args.account}/tags/${args.tag}`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "delete_tag",
    description: "Delete a tag from an account",
    inputSchema: {
      type: "object",
      properties: {
        account: { type: "string", description: "Account identifier" },
        tag: { type: "string", description: "Tag identifier" },
      },
      required: ["account", "tag"],
    },
    handler: async (args) =>
      apiCall({
        method: "DELETE",
        path: `/1/accounts/${args.account}/tags/${args.tag}`,
      }),
  },
  {
    name: "list_users",
    description: "List users for an account",
    inputSchema: {
      type: "object",
      properties: {
        account: { type: "string", description: "Account identifier" },
      },
      required: ["account"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/2/accounts/${args.account}/users`,
      }),
  },
  {
    name: "list_user_app_accesses",
    description: "List app accesses for a user",
    inputSchema: {
      type: "object",
      properties: {
        account: { type: "string", description: "Account identifier" },
        user: { type: "string", description: "User identifier" },
      },
      required: ["account", "user"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/2/accounts/${args.account}/users/${args.user}/app_accesses`,
      }),
  },
];

// ─── Teams (6) ──────────────────────────────────────────────────────────────

export const teamTools: ToolDef[] = [
  {
    name: "list_teams",
    description: "List teams for an account",
    inputSchema: {
      type: "object",
      properties: {
        account: { type: "string", description: "Account identifier" },
      },
      required: ["account"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/accounts/${args.account}/teams`,
      }),
  },
  {
    name: "create_team",
    description: "Create a team for an account",
    inputSchema: {
      type: "object",
      properties: {
        account: { type: "string", description: "Account identifier" },
        body: { type: "object", description: "Team data" },
      },
      required: ["account", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/1/accounts/${args.account}/teams`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "get_team",
    description: "Get a specific team by ID",
    inputSchema: {
      type: "object",
      properties: {
        account: { type: "string", description: "Account identifier" },
        team: { type: "string", description: "Team identifier" },
      },
      required: ["account", "team"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/accounts/${args.account}/teams/${args.team}`,
      }),
  },
  {
    name: "update_team",
    description: "Update a team",
    inputSchema: {
      type: "object",
      properties: {
        account: { type: "string", description: "Account identifier" },
        team: { type: "string", description: "Team identifier" },
        body: { type: "object", description: "Updated team data" },
      },
      required: ["account", "team", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "PATCH",
        path: `/1/accounts/${args.account}/teams/${args.team}`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "delete_team",
    description: "Delete a team",
    inputSchema: {
      type: "object",
      properties: {
        account: { type: "string", description: "Account identifier" },
        team: { type: "string", description: "Team identifier" },
      },
      required: ["account", "team"],
    },
    handler: async (args) =>
      apiCall({
        method: "DELETE",
        path: `/1/accounts/${args.account}/teams/${args.team}`,
      }),
  },
  {
    name: "invite_user",
    description: "Invite a user to an account",
    inputSchema: {
      type: "object",
      properties: {
        account: { type: "string", description: "Account identifier" },
        body: { type: "object", description: "Invitation data" },
      },
      required: ["account", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/1/accounts/${args.account}/invitations`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "cancel_invitation",
    description: "Cancel a user invitation",
    inputSchema: {
      type: "object",
      properties: {
        account: { type: "string", description: "Account identifier" },
        invitation: { type: "string", description: "Invitation identifier" },
      },
      required: ["account", "invitation"],
    },
    handler: async (args) =>
      apiCall({
        method: "DELETE",
        path: `/1/accounts/${args.account}/invitations/${args.invitation}`,
      }),
  },
];

// ─── kSuite & Mailbox (8) ───────────────────────────────────────────────────

export const ksuiteTools: ToolDef[] = [
  {
    name: "get_my_ksuite",
    description: "Get a specific kSuite by ID",
    inputSchema: {
      type: "object",
      properties: {
        my_k_suite_id: { type: "string", description: "kSuite ID" },
      },
      required: ["my_k_suite_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/my_ksuite/${args.my_k_suite_id}`,
      }),
  },
  {
    name: "get_current_ksuite",
    description: "Get the current kSuite",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async () =>
      apiCall({
        method: "GET",
        path: "/1/my_ksuite/current",
      }),
  },
  {
    name: "cancel_ksuite_unsubscribe",
    description: "Cancel kSuite unsubscribe",
    inputSchema: {
      type: "object",
      properties: {
        my_k_suite_id: { type: "string", description: "kSuite ID" },
      },
      required: ["my_k_suite_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: `/1/my_ksuite/${args.my_k_suite_id}/cancel_unsubscribe`,
      }),
  },
  {
    name: "list_mailboxes",
    description: "List kSuite mailboxes",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async () =>
      apiCall({
        method: "GET",
        path: "/2/profile/ksuites/mailboxes",
      }),
  },
  {
    name: "attach_mailbox",
    description: "Attach a mailbox to kSuite",
    inputSchema: {
      type: "object",
      properties: {
        body: { type: "object", description: "Mailbox data" },
      },
      required: ["body"],
    },
    handler: async (args) =>
      apiCall({
        method: "POST",
        path: "/2/profile/ksuites/mailboxes",
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "set_primary_mailbox",
    description: "Set a mailbox as primary",
    inputSchema: {
      type: "object",
      properties: {
        mailbox_id: { type: "string", description: "Mailbox ID" },
      },
      required: ["mailbox_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "PUT",
        path: `/2/profile/ksuites/mailboxes/${args.mailbox_id}/set_primary`,
      }),
  },
  {
    name: "update_mailbox_password",
    description: "Update mailbox password",
    inputSchema: {
      type: "object",
      properties: {
        mailbox_id: { type: "string", description: "Mailbox ID" },
        body: { type: "object", description: "Password update data" },
      },
      required: ["mailbox_id", "body"],
    },
    handler: async (args) =>
      apiCall({
        method: "PUT",
        path: `/2/profile/ksuites/mailboxes/${args.mailbox_id}/update_password`,
        body: args.body as Record<string, unknown>,
      }),
  },
  {
    name: "unlink_mailbox",
    description: "Unlink a mailbox from kSuite",
    inputSchema: {
      type: "object",
      properties: {
        mailbox_id: { type: "string", description: "Mailbox ID" },
      },
      required: ["mailbox_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "DELETE",
        path: `/2/profile/ksuites/mailboxes/${args.mailbox_id}`,
      }),
  },
];

// ─── Misc (5) ───────────────────────────────────────────────────────────────

export const miscTools: ToolDef[] = [
  {
    name: "list_products",
    description: "List all products",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async () =>
      apiCall({
        method: "GET",
        path: "/1/products",
      }),
  },
  {
    name: "list_actions",
    description: "List all actions",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async () =>
      apiCall({
        method: "GET",
        path: "/1/actions",
      }),
  },
  {
    name: "get_action",
    description: "Get a specific action by ID",
    inputSchema: {
      type: "object",
      properties: {
        action_id: { type: "string", description: "Action ID" },
      },
      required: ["action_id"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/actions/${args.action_id}`,
      }),
  },
  {
    name: "list_tasks",
    description: "List async tasks",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async () =>
      apiCall({
        method: "GET",
        path: "/1/async/tasks",
      }),
  },
  {
    name: "get_task",
    description: "Get a specific task by UUID",
    inputSchema: {
      type: "object",
      properties: {
        task_uuid: { type: "string", description: "Task UUID" },
      },
      required: ["task_uuid"],
    },
    handler: async (args) =>
      apiCall({
        method: "GET",
        path: `/1/async/tasks/${args.task_uuid}`,
      }),
  },
];

// ─── Export all core tools ──────────────────────────────────────────────────

export const coreTools: ToolDef[] = [
  ...eventTools,
  ...profileTools,
  ...appPasswordTools,
  ...accountTools,
  ...teamTools,
  ...ksuiteTools,
  ...miscTools,
];
