/**
 * Shared HTTP client for the Infomaniak API.
 *
 * Handles:
 * - Bearer token authentication
 * - Rate limiting (60 req/min — queues requests if needed)
 * - Pagination (page/per_page, offset/limit)
 * - Error parsing (result: success | error)
 * - Base URL: https://api.infomaniak.com
 */

const BASE_URL = "https://api.infomaniak.com";
const RATE_LIMIT_PER_MIN = 60;
const RATE_WINDOW_MS = 60_000;

/** Infomaniak API error response. */
export interface InfomaniakError {
  code: string;
  description: string;
  context?: Record<string, unknown>;
  errors?: Array<{
    code: string;
    description: string;
    context?: Record<string, unknown>;
  }>;
}

/** Infomaniak API success response. */
export interface InfomaniakResponse<T = unknown> {
  result: "success" | "error" | "asynchronous";
  data?: T;
  error?: InfomaniakError;
  total?: number;
  page?: number;
  pages?: number;
  items_per_page?: number;
}

/** Parameters for a generic API call. */
export interface ApiCallParams {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  body?: Record<string, unknown>;
  params?: Record<string, string | number | boolean | undefined>;
}

// ─── Rate limiter ─────────────────────────────────────────────────────────────

let requestTimestamps: number[] = [];

function waitForRateLimit(): void {
  const now = Date.now();
  // Remove timestamps older than the rate window
  requestTimestamps = requestTimestamps.filter(
    (ts) => now - ts < RATE_WINDOW_MS,
  );
  if (requestTimestamps.length >= RATE_LIMIT_PER_MIN) {
    const oldest = requestTimestamps[0];
    const waitMs = RATE_WINDOW_MS - (now - oldest) + 10; // +10ms buffer
    if (waitMs > 0) {
      // Sleep synchronously — MCP tools can block
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, waitMs);
    }
    requestTimestamps = requestTimestamps.filter(
      (ts) => Date.now() - ts < RATE_WINDOW_MS,
    );
  }
  requestTimestamps.push(Date.now());
}

// ─── Core request function ────────────────────────────────────────────────────

function getToken(): string {
  const token = process.env.INFOMANIAK_API_TOKEN;
  if (!token) {
    throw new Error(
      "INFOMANIAK_API_TOKEN environment variable is not set. Get a token at https://manager.infomaniak.com/v3/ng/accounts/token/list",
    );
  }
  return token;
}

function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): string {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

export async function apiCall<T = unknown>(
  params: ApiCallParams,
): Promise<InfomaniakResponse<T>> {
  waitForRateLimit();

  const url = buildUrl(params.path, params.params);
  const token = getToken();

  const fetchOptions: RequestInit = {
    method: params.method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  if (params.body && params.method !== "GET") {
    fetchOptions.body = JSON.stringify(params.body);
  }

  const response = await fetch(url, fetchOptions);
  const json = (await response.json()) as InfomaniakResponse<T>;

  if (json.result === "error") {
    const err = json.error;
    const desc = err?.description || "Unknown error";
    const code = err?.code || "unknown";
    throw new Error(`Infomaniak API error [${code}]: ${desc}`);
  }

  return json;
}

// ─── Pagination helpers ──────────────────────────────────────────────────────

export interface PaginatedParams {
  page?: number;
  per_page?: number;
  limit?: number;
  skip?: number;
  order_by?: string;
  order?: "asc" | "desc";
}

export async function paginate<T>(
  path: string,
  params: PaginatedParams = {},
): Promise<{
  data: T[];
  total: number;
  page: number;
  pages: number;
}> {
  const response = await apiCall<T[]>({
    method: "GET",
    path,
    params: params as Record<string, string | number | boolean | undefined>,
  });

  return {
    data: response.data || [],
    total: response.total ?? 0,
    page: response.page ?? 1,
    pages: response.pages ?? 1,
  };
}
