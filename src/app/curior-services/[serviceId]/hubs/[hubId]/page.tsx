"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import RidersPage from "@/features/riders/page";
import { useHubsByCourierService } from "@/features/hubs/hooks/useHubsByCourierService";
import { useRidersByHub } from "@/features/riders/hooks/useRidersByHub";

function displayValue(value?: string | null): string {
  return value?.trim() || "-";
}

export default function HubRidersPage() {
  const params = useParams<{ serviceId: string; hubId: string }>();
  const router = useRouter();

  const serviceId = decodeURIComponent(
    Array.isArray(params?.serviceId) ? params.serviceId[0] : params?.serviceId ?? ""
  );
  const hubId = decodeURIComponent(
    Array.isArray(params?.hubId) ? params.hubId[0] : params?.hubId ?? ""
  );

  const { hubs } = useHubsByCourierService(serviceId);
  const selectedHub = hubs.find((hub) => hub.id === hubId);

  const {
    riders,
    isLoading,
    error,
    loadRidersByHub,
    riderPage,
    riderTotal,
    totalRiderPages,
    hasNextRiderPage,
    handlePreviousRiderPage,
    handleNextRiderPage,
  } = useRidersByHub(serviceId);

  useEffect(() => {
    if (!hubId) return;
    loadRidersByHub(hubId, { page: 1, limit: 10 });
  }, [hubId, loadRidersByHub]);

  return (
    <main className="h-screen overflow-y-auto bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900">
              Hub Riders: {displayValue(selectedHub?.name ?? selectedHub?.city ?? hubId)}
            </h1>
            <p className="text-sm text-slate-500">Riders for the selected hub.</p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push(`/curior-services/${encodeURIComponent(serviceId)}`)}
          >
            Back to Service
          </Button>
        </header>

        <RidersPage
          serviceId={serviceId}
          hubId={hubId}
          riders={riders}
          isLoading={isLoading}
          error={error}
          riderPage={riderPage}
          riderTotal={riderTotal}
          totalRiderPages={totalRiderPages}
          hasNextRiderPage={hasNextRiderPage}
          onPreviousPageAction={handlePreviousRiderPage}
          onNextPageAction={handleNextRiderPage}
        />
      </div>
    </main>
  );
}
