"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { getMerchantsByCourierServiceId } from "../api/merchant.api";
import type { Merchant, MerchantListResponse } from "../types/merchant.types";
import type { PaginationQuery } from "../../curior-services/types/courior-service.types";

const DEFAULT_QUERY: Required<PaginationQuery> = {
  page: 1,
  limit: 10,
};

export function useMerchantsByCourierService(courierServiceId?: string) {
  const { data: session } = useSession();

  const [selectedCourierServiceId, setSelectedCourierServiceId] = useState<string | null>(null);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [pagination, setPagination] = useState<Omit<MerchantListResponse, "data">>({
    page: DEFAULT_QUERY.page,
    limit: DEFAULT_QUERY.limit,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMerchants = useCallback(
    async (courierServiceId: string, query: PaginationQuery = DEFAULT_QUERY) => {
      try {
        setIsLoading(true);
        setError(null);
        setSelectedCourierServiceId(courierServiceId);

        const response = await getMerchantsByCourierServiceId(
          courierServiceId,
          query,
          session?.accessToken
        );

        setMerchants(response.data);
        setPagination({
          page: response.page,
          limit: response.limit,
          total: response.total,
        });
      } catch (err) {
        setMerchants([]);
        setPagination({
          page: query.page,
          limit: query.limit,
          total: 0,
        });
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load merchants for selected courier service"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [session?.accessToken]
  );

  useEffect(() => {
    if (!courierServiceId) return;
    loadMerchants(courierServiceId, DEFAULT_QUERY);
  }, [courierServiceId, loadMerchants]);

  const merchantPage = pagination.page ?? DEFAULT_QUERY.page;
  const merchantLimit = pagination.limit ?? DEFAULT_QUERY.limit;
  const merchantTotal = pagination.total ?? 0;
  const totalMerchantPages = merchantTotal > 0 ? Math.ceil(merchantTotal / merchantLimit) : 1;
  const hasNextMerchantPage =
    merchantTotal > 0 ? merchantPage < totalMerchantPages : merchants.length === merchantLimit;

  function handlePreviousMerchantPage() {
    if (!selectedCourierServiceId || merchantPage <= 1) return;
    loadMerchants(selectedCourierServiceId, {
      page: merchantPage - 1,
      limit: merchantLimit,
    });
  }

  function handleNextMerchantPage() {
    if (!selectedCourierServiceId || !hasNextMerchantPage) return;
    loadMerchants(selectedCourierServiceId, {
      page: merchantPage + 1,
      limit: merchantLimit,
    });
  }

  return {
    hasNextMerchantPage,
    handleNextMerchantPage,
    handlePreviousMerchantPage,
    selectedCourierServiceId,
    merchants,
    merchantPage,
    merchantTotal,
    pagination,
    isLoading,
    error,
    loadMerchants,
    totalMerchantPages,
  };
}
