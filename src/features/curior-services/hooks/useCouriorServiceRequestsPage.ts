"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { approveCouriorServiceRequest } from "@/features/curior-services/api/couriorapi";
import { useCouriorServiceRequests } from "@/features/curior-services/hooks/useCouriorServiceRequests";
import { addApprovedServiceToCache } from "@/features/curior-services/lib/approved-services-cache";
import type { CouriorServiceRequest } from "@/features/curior-services/types/courior-service.types";

export const PAGE_SIZE = 10;

export function displayValue(value?: string | null): string {
  return value?.trim() || "-";
}

export function requestStatus(
  request: CouriorServiceRequest,
  approvedIds: string[] = [],
  rejectedIds: string[] = []
): string {
  const id = request.id?.trim();
  if (id && rejectedIds.includes(id)) return "Rejected";
  return request.approved || (id && approvedIds.includes(id)) ? "Approved" : "Not Approved";
}

export function canApprove(
  request: CouriorServiceRequest,
  approvedIds: string[] = [],
  rejectedIds: string[] = []
): boolean {
  const id = request.id?.trim();
  if (id && rejectedIds.includes(id)) return false;
  return !(request.approved === true || (id && approvedIds.includes(id)));
}

export function requestDate(request: CouriorServiceRequest): string {
  const raw = request.createdAt ?? request.requestedAt;
  if (!raw?.trim()) return "-";

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;

  return new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function useCouriorServiceRequestsPage() {
  const { data: session } = useSession();
  const { requests, isLoading, error, refresh } = useCouriorServiceRequests();
  const [page, setPage] = useState(1);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [approvedIds, setApprovedIds] = useState<string[]>([]);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [removedRequestIds] = useState<string[]>([]);
  const [rejectedIds, setRejectedIds] = useState<string[]>(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem("courior:rejected-requests") : null;
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map((v: unknown) => (v ?? "").toString().trim()).filter(Boolean) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!actionMessage && !actionError) return;
    const timeoutId = setTimeout(() => {
      setActionMessage(null);
      setActionError(null);
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [actionMessage, actionError]);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") window.localStorage.setItem("courior:rejected-requests", JSON.stringify(rejectedIds));
    } catch {
      // noop
    }
  }, [rejectedIds]);

  async function onApprove(requestId: string) {
    try {
      const safeId = requestId?.trim();
      setApprovingId(safeId);
      setActionError(null);
      setApprovedIds((prev) => (prev.includes(safeId) ? prev : [...prev, safeId]));
      const response = await approveCouriorServiceRequest(requestId, session?.accessToken);
      addApprovedServiceToCache(response.data);
      setRejectedIds((prev) => prev.filter((id) => id !== safeId));
      try {
        if (typeof window !== "undefined") window.localStorage.setItem("courior:rejected-requests", JSON.stringify(rejectedIds.filter((id) => id !== safeId)));
      } catch {}
      setActionMessage(response.message || "Courier service request approved successfully");
    } catch (err) {
      const safeId = requestId?.trim();
      setApprovedIds((prev) => prev.filter((id) => id !== safeId));
      setActionError(err instanceof Error ? err.message : "Failed to approve courier service request");
    } finally {
      setApprovingId(null);
    }
  }

  async function onReject(requestId: string) {
    try {
      setActionError(null);
      const safeId = requestId?.trim();
      setRejectedIds((prev) => (prev.includes(safeId) ? prev : [...prev, safeId]));
      setActionMessage("Courier service request rejected");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to reject courier service request");
      const safeId = requestId?.trim();
      setRejectedIds((prev) => prev.filter((id) => id !== safeId));
    }
  }

  const visibleData = requests.filter((request) => !removedRequestIds.includes(request.id));
  const recalculatedTotalPages = Math.max(1, Math.ceil(visibleData.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(page, recalculatedTotalPages);
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
  const visibleRequests = visibleData.slice(startIndex, startIndex + PAGE_SIZE);

  return {
    requests,
    isLoading,
    error,
    refresh,
    page,
    setPage,
    visibleRequests,
    visibleCount: visibleData.length,
    recalculatedTotalPages,
    safeCurrentPage,
    approvingId,
    approvedIds,
    rejectedIds,
    actionMessage,
    actionError,
    onApprove,
    onReject,
  };
}
