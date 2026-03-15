"use client";

import { useCallback, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

import { getRiders } from "../api/rider.api";
import type { Rider, RiderListResponse } from "../types/rider.types";
import type { PaginationQuery } from "../../curior-services/types/courior-service.types";

const DEFAULT_QUERY: Required<PaginationQuery> = {
  page: 1,
  limit: 10,
};

type RiderPagination = Omit<RiderListResponse, "data">;

export function useRidersByHub(courierServiceId?: string) {
  const { data: session } = useSession();

  const [selectedHubId, setSelectedHubId] = useState<string | null>(null);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [pagination, setPagination] = useState<RiderPagination>({
    page: DEFAULT_QUERY.page,
    limit: DEFAULT_QUERY.limit,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRidersByHub = useCallback(
    async (hubId: string, query: PaginationQuery = DEFAULT_QUERY) => {
      if (!courierServiceId) {
        setRiders([]);
        setError("Invalid courier service.");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        setSelectedHubId(hubId);

        const response = await getRiders(
          courierServiceId,
          { ...query, hubId },
          session?.accessToken
        );

        setRiders(response.data);
        setPagination({
          page: response.page,
          limit: response.limit,
          total: response.total,
        });
      } catch (err) {
        setRiders([]);
        setPagination({
          page: query.page,
          limit: query.limit,
          total: 0,
        });
        setError(err instanceof Error ? err.message : "Failed to load riders for selected hub");
      } finally {
        setIsLoading(false);
      }
    },
    [courierServiceId, session?.accessToken]
  );

  const riderPage = pagination.page ?? DEFAULT_QUERY.page;
  const riderLimit = pagination.limit ?? DEFAULT_QUERY.limit;
  const riderTotal = pagination.total ?? 0;
  const totalRiderPages = riderTotal > 0 ? Math.ceil(riderTotal / riderLimit) : 1;
  const hasNextRiderPage = useMemo(
    () => (riderTotal > 0 ? riderPage < totalRiderPages : riders.length === riderLimit),
    [riderTotal, riderPage, totalRiderPages, riders.length, riderLimit]
  );

  function handlePreviousRiderPage() {
    if (!selectedHubId || riderPage <= 1) return;
    loadRidersByHub(selectedHubId, {
      page: riderPage - 1,
      limit: riderLimit,
    });
  }

  function handleNextRiderPage() {
    if (!selectedHubId || !hasNextRiderPage) return;
    loadRidersByHub(selectedHubId, {
      page: riderPage + 1,
      limit: riderLimit,
    });
  }

  return {
    selectedHubId,
    riders,
    riderPage,
    riderTotal,
    totalRiderPages,
    hasNextRiderPage,
    isLoading,
    error,
    pagination,
    loadRidersByHub,
    handlePreviousRiderPage,
    handleNextRiderPage,
  };
}
