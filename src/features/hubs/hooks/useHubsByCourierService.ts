"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { getHubsByCourierServiceId } from "../api/hub.api";
import type { Hub, HubListResponse } from "../types/hub.types";
import type { PaginationQuery } from "../../curior-services/types/courior-service.types";

const DEFAULT_QUERY: Required<PaginationQuery> = {
  page: 1,
  limit: 10,
};

export function useHubsByCourierService(courierServiceId?: string) {
  const { data: session } = useSession();

  const [selectedCourierServiceId, setSelectedCourierServiceId] = useState<string | null>(null);
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [pagination, setPagination] = useState<Omit<HubListResponse, "data">>({
    page: DEFAULT_QUERY.page,
    limit: DEFAULT_QUERY.limit,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHubs = useCallback(
    async (courierServiceId: string, query: PaginationQuery = DEFAULT_QUERY) => {
      try {
        setIsLoading(true);
        setError(null);
        setSelectedCourierServiceId(courierServiceId);

        const response = await getHubsByCourierServiceId(
          courierServiceId,
          query,
          session?.accessToken
        );

        setHubs(response.data);
        setPagination({
          page: response.page,
          limit: response.limit,
          total: response.total,
        });
      } catch (err) {
        setHubs([]);
        setPagination({
          page: query.page,
          limit: query.limit,
          total: 0,
        });
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load hubs for selected courier service"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [session?.accessToken]
  );

  useEffect(() => {
    if (!courierServiceId) return;
    loadHubs(courierServiceId, DEFAULT_QUERY);
  }, [courierServiceId, loadHubs]);

  const hubPage = pagination.page ?? DEFAULT_QUERY.page;
  const hubLimit = pagination.limit ?? DEFAULT_QUERY.limit;
  const hubTotal = pagination.total ?? 0;
  const totalHubPages = hubTotal > 0 ? Math.ceil(hubTotal / hubLimit) : 1;
  const hasNextHubPage = hubTotal > 0 ? hubPage < totalHubPages : hubs.length === hubLimit;

  function handlePreviousHubPage() {
    if (!selectedCourierServiceId || hubPage <= 1) return;
    loadHubs(selectedCourierServiceId, {
      page: hubPage - 1,
      limit: hubLimit,
    });
  }

  function handleNextHubPage() {
    if (!selectedCourierServiceId || !hasNextHubPage) return;
    loadHubs(selectedCourierServiceId, {
      page: hubPage + 1,
      limit: hubLimit,
    });
  }

  return {
    hasNextHubPage,
    handleNextHubPage,
    handlePreviousHubPage,
    selectedCourierServiceId,
    hubs,
    hubPage,
    hubTotal,
    pagination,
    isLoading,
    error,
    loadHubs,
    totalHubPages,
  };
}
