"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { getCouriorServiceRequests } from "@/features/curior-services/api/couriorapi";
import type { CouriorServiceRequest } from "@/features/curior-services/types/courior-service.types";

export function useCouriorServiceRequests() {
  const { data: session, status } = useSession();

  const [requests, setRequests] = useState<CouriorServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getCouriorServiceRequests(session?.accessToken);
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load courier service requests");
    } finally {
      setIsLoading(false);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    if (status === "authenticated") {
      loadRequests();
    } else {
      setIsLoading(false);
    }
  }, [status, loadRequests]);

  return {
    requests,
    isLoading,
    error,
    refresh: loadRequests,
  };
}
