import type { PaginationQuery } from "../../curior-services/types/courior-service.types";
import type { Hub, HubListResponse } from "../types/hub.types";

const DEFAULT_PAGE = 1;
const PAGE_SIZE = 10;
const DATA_KEYS = ["data", "items", "results"] as const;

const toRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : null;

const toNumber = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

const clean = (value?: string) => value?.trim();

const auth = (accessToken?: string): HeadersInit | undefined =>
  accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;

const serviceHeaders = (courierServiceId: string, accessToken?: string): HeadersInit => ({
  ...(auth(accessToken) ?? {}),
  "x-tenant-id": courierServiceId,
  "x-tenant": courierServiceId,
  "x-courier-service-id": courierServiceId,
  tenantId: courierServiceId,
  courierServiceId,
});

const createParams = (
  query: PaginationQuery = {},
  extras?: Record<string, string | undefined>
) => {
  const page = query.page ?? DEFAULT_PAGE;
  const limit = query.limit ?? PAGE_SIZE;
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });

  Object.entries(extras ?? {}).forEach(([key, value]) => {
    const safeValue = clean(value);
    if (safeValue) params.set(key, safeValue);
  });

  return { page, limit, params };
};

const list = <T,>(payload: unknown): T[] => {
  if (Array.isArray(payload)) return payload as T[];

  const root = toRecord(payload);
  const nested = toRecord(root?.result);
  const fromRoot = DATA_KEYS.map((k) => root?.[k]).find(Array.isArray);
  if (Array.isArray(fromRoot)) return fromRoot as T[];

  const fromNested = DATA_KEYS.map((k) => nested?.[k]).find(Array.isArray);
  return Array.isArray(fromNested) ? (fromNested as T[]) : [];
};

const paged = <T,>(payload: unknown, page: number, limit: number) => {
  const root = toRecord(payload);
  const nested = toRecord(root?.result);

  return {
    data: list<T>(payload),
    total: toNumber(root?.total) ?? toNumber(nested?.total),
    page: toNumber(root?.page) ?? toNumber(nested?.page) ?? page,
    limit: toNumber(root?.limit) ?? toNumber(nested?.limit) ?? limit,
  };
};

async function requestJson(url: string, errorMessage: string, init?: RequestInit): Promise<unknown> {
  const response = await fetch(url, { cache: "no-store", ...init });
  if (!response.ok) throw new Error(errorMessage);
  return response.json();
}

export async function getHubsByCourierServiceId(
  courierServiceId: string,
  query: PaginationQuery = {},
  accessToken?: string
): Promise<HubListResponse> {
  const { page, limit, params } = createParams(query, { courierServiceId });
  const payload = await requestJson(
    `/api/backend/hubs?${params}`,
    "Failed to fetch hubs for the selected courier service",
    { headers: serviceHeaders(courierServiceId, accessToken) }
  );

  return paged<Hub>(payload, page, limit);
}
