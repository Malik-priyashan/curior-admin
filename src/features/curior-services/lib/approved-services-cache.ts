import type { CouriorService } from "@/features/curior-services/types/courior-service.types";

const APPROVED_SERVICES_CACHE_KEY = "courior:approved-services-cache";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function normalizeId(value?: string | null): string {
  return value?.trim() || "";
}

function readCache(): CouriorService[] {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(APPROVED_SERVICES_CACHE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as CouriorService[]) : [];
  } catch {
    return [];
  }
}

function writeCache(services: CouriorService[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(APPROVED_SERVICES_CACHE_KEY, JSON.stringify(services));
}

export function getApprovedServicesCache(): CouriorService[] {
  return readCache();
}

export function addApprovedServiceToCache(service: CouriorService) {
  const serviceId = normalizeId(service.id);
  if (!serviceId) return;

  const cache = readCache();
  const deduped = cache.filter((item) => normalizeId(item.id) !== serviceId);
  writeCache([service, ...deduped]);
}

export function pruneApprovedServicesCache(existingServices: CouriorService[]) {
  const existingIds = new Set(existingServices.map((service) => normalizeId(service.id)).filter(Boolean));
  if (!existingIds.size) return;

  const cache = readCache();
  const next = cache.filter((service) => !existingIds.has(normalizeId(service.id)));
  if (next.length !== cache.length) writeCache(next);
}
