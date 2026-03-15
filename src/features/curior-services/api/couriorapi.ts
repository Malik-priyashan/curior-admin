import type {
  CouriorService,
  CouriorServiceRequest,
  PaginationQuery,
} from "../types/courior-service.types";
import {
  toCreateCourierServiceDto,
  type CreateCourierServiceApiResponse,
  type CreateCourierServiceRequestPayload,
  type CreateCourierServiceRequestResponse,
} from "../dto/courior-service.dto";

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

const jsonHeaders = (accessToken?: string): HeadersInit => ({
  "Content-Type": "application/json",
  ...(auth(accessToken) ?? {}),
});

export const createParams = (
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

export const paged = <T,>(payload: unknown, page: number, limit: number) => {
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

export async function getCouriorServices(
  accessToken?: string
): Promise<CouriorService[]> {
  return list<CouriorService>(
    await requestJson("/api/backend/courier-service", "Failed to fetch courier services", { headers: auth(accessToken) })
  );
}

export async function getCouriorServiceRequests(
  accessToken?: string
): Promise<CouriorServiceRequest[]> {
  return list<CouriorServiceRequest>(
    await requestJson("/api/backend/courier-service/requests", "Failed to fetch courier service requests", { headers: auth(accessToken) })
  );
}

export async function approveCouriorServiceRequest(
  requestId: string,
  accessToken?: string
): Promise<CreateCourierServiceRequestResponse> {
  const safeId = requestId.trim();
  if (!safeId) throw new Error("Courier service request id is required");
  const response = (await requestJson(`/api/backend/courier-service/requests/${encodeURIComponent(safeId)}/approve`, "Failed to approve courier service request", { method: "POST", headers: jsonHeaders(accessToken) })) as CreateCourierServiceApiResponse;
  if (response.error?.trim() || !response.data?.id) throw new Error(response.error?.trim() || response.message || "Failed to approve courier service request");
  return { message: response.message || "Courier service request approved successfully", data: response.data };
}

export async function createCourierServiceRequest(
  payload: CreateCourierServiceRequestPayload,
  accessToken?: string
): Promise<CreateCourierServiceRequestResponse> {
  const response = (await requestJson("/api/backend/courier-service", "Failed to create courier service request", { method: "POST", headers: jsonHeaders(accessToken), body: JSON.stringify(toCreateCourierServiceDto(payload)) })) as CreateCourierServiceApiResponse;
  const data = response.data;
  if (response.error?.trim() || !data?.id) throw new Error(response.error?.trim() || response.message || "Courier service was not created");
  return { message: response.message || "Courier service request created successfully", data };
}

export { registerCuriorAdmin, getAdminUsers as getUsers } from "@/features/admin/api/admin.api";