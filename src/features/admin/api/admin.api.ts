import type { PaginationQuery } from "@/features/curior-services/types/courior-service.types";
import type { RegisterAdminPayload, RegisterAdminResponse } from "@/features/admin/dto/admin.dto";
import type { AdminUser, AdminUserListResponse } from "@/features/admin/types/admin.types";

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

const createParams = (query: PaginationQuery = {}) => {
  const page = query.page ?? DEFAULT_PAGE;
  const limit = query.limit ?? PAGE_SIZE;
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
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

export async function registerCuriorAdmin(
  payload: RegisterAdminPayload
): Promise<RegisterAdminResponse> {
  return (await requestJson("/api/backend/auth/register", "Failed to register admin", {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  })) as RegisterAdminResponse;
}

export async function getAdminUsers(
  query: PaginationQuery = {},
  accessToken?: string,
  courierServiceId?: string
): Promise<AdminUserListResponse> {
  const { page, limit, params } = createParams(query);
  const payload = await requestJson(`/api/backend/auth/users?${params}`, "Failed to fetch users", {
    headers: auth(accessToken),
  });

  const users = paged<AdminUser>(payload, page, limit);
  if (!clean(courierServiceId)) return users;

  const selectedCourierServiceId = courierServiceId!.trim();
  const data = users.data.filter(
    (u) => (u.role ?? "").toUpperCase() === "ADMIN" && u.courierServiceId === selectedCourierServiceId
  );
  return { ...users, data, total: data.length };
}
