"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getCouriorServices } from "../api/couriorapi";
import {
  getApprovedServicesCache,
  pruneApprovedServicesCache,
} from "@/features/curior-services/lib/approved-services-cache";
import type { CouriorService } from "../types/courior-service.types";

export type CourierDetailsTab = "merchants" | "hubs" | "admins" | "branding";

function displayValue(value?: string | null): string {
  return value?.trim() || "-";
}

export function useCouriorServices() {
  const { data: session, status } = useSession();

  const [services, setServices] = useState<CouriorService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<CourierDetailsTab>("merchants");

  const loadServices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getCouriorServices(
        session?.accessToken
      );
      const existingIds = new Set(data.map((service) => service.id?.trim()).filter(Boolean));
      const cachedApprovedServices = getApprovedServicesCache().filter(
        (service) => !existingIds.has(service.id?.trim())
      );

      pruneApprovedServicesCache(data);
      setServices([...cachedApprovedServices, ...data]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load courier services"
      );
    } finally {
      setIsLoading(false);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    if (status === "authenticated") {
      loadServices();
    } else {
      setIsLoading(false);
    }
  }, [status, loadServices]);

  const getServiceNameById = useCallback(
    (serviceId: string) => {
      if (!serviceId) return "-";
      const current = services.find((service) => service.id === serviceId);
      return displayValue(current?.serviceName);
    },
    [services]
  );

  return {
    activeTab,
    services,
    isLoading,
    error,
    getServiceNameById,
    setActiveTab,
    refresh: loadServices,
  };
}