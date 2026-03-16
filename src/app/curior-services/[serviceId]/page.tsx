"use client";

import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import AdminPage from "@/features/admin/page";
import MerchantsPage from "@/features/merchants/page";
import HubsPage from "@/features/hubs/page";
import BrandingTab from "@/features/curior-services/components/BrandingTab";
import { useAdminUsersByCourierService } from "@/features/admin/hooks/useAdminUsersByCourierService";
import { useCouriorServices } from "@/features/curior-services/hooks/useCouriorServices";
import { useHubsByCourierService } from "@/features/hubs/hooks/useHubsByCourierService";
import { useMerchantsByCourierService } from "@/features/merchants/hooks/useMerchantsByCourierService";

export default function CourierServiceDetailsPage() {
  const params = useParams<{ serviceId: string }>();
  const router = useRouter();
  const serviceIdParam = params?.serviceId;
  const serviceId = decodeURIComponent(
    Array.isArray(serviceIdParam) ? serviceIdParam[0] : serviceIdParam ?? ""
  );

  const { activeTab, getServiceNameById, setActiveTab } = useCouriorServices();
  const {
    merchants,
    isLoading: isMerchantsLoading,
    error: merchantsError,
    hasNextMerchantPage,
    handleNextMerchantPage,
    handlePreviousMerchantPage,
    merchantPage,
    merchantTotal,
    totalMerchantPages,
  } = useMerchantsByCourierService(serviceId);
  const {
    hubs,
    isLoading: isHubsLoading,
    error: hubsError,
    hasNextHubPage,
    handleNextHubPage,
    handlePreviousHubPage,
    hubPage,
    hubTotal,
    totalHubPages,
  } = useHubsByCourierService(serviceId);
  const {
    admins,
    error: adminsError,
    formData,
    goToNextAdminPage,
    goToPreviousAdminPage,
    handleChange,
    handleSubmit,
    handleToggleAddForm,
    isAddFormOpen,
    isLoading: isAdminsLoading,
    isSubmitting,
    resetForm,
    safeAdminPage,
    submitError,
    submitMessage,
    totalAdminPages,
    visibleAdmins,
  } = useAdminUsersByCourierService(serviceId);

  const selectedServiceName = getServiceNameById(serviceId);

  return (
    <main className="h-screen overflow-y-auto bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900">Courier Service: {selectedServiceName}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push("/curior-services")}>
              Back
            </Button>
          </div>
        </header>

        <div className="flex items-center">
          <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab("merchants")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                activeTab === "merchants"
                  ? "bg-slate-900 text-white"
                  : "bg-transparent text-slate-600 hover:bg-slate-100"
              }`}
            >
              Merchants
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("hubs")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                activeTab === "hubs"
                  ? "bg-slate-900 text-white"
                  : "bg-transparent text-slate-600 hover:bg-slate-100"
              }`}
            >
              Hubs
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("admins")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                activeTab === "admins"
                  ? "bg-slate-900 text-white"
                  : "bg-transparent text-slate-600 hover:bg-slate-100"
              }`}
            >
              Admins
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("branding")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                activeTab === "branding"
                  ? "bg-slate-900 text-white"
                  : "bg-transparent text-slate-600 hover:bg-slate-100"
              }`}
            >
              Branding
            </button>
          </div>
        </div>

        {activeTab === "merchants" && (
          <MerchantsPage
            serviceId={serviceId}
            merchants={merchants}
            isLoading={isMerchantsLoading}
            error={merchantsError}
            merchantPage={merchantPage}
            merchantTotal={merchantTotal}
            totalMerchantPages={totalMerchantPages}
            hasNextMerchantPage={hasNextMerchantPage}
            onPreviousPage={handlePreviousMerchantPage}
            onNextPage={handleNextMerchantPage}
          />
        )}

        {activeTab === "hubs" && (
          <HubsPage
            serviceId={serviceId}
            hubs={hubs}
            isLoading={isHubsLoading}
            error={hubsError}
            hubPage={hubPage}
            hubTotal={hubTotal}
            totalHubPages={totalHubPages}
            hasNextHubPage={hasNextHubPage}
            onPreviousPage={handlePreviousHubPage}
            onNextPage={handleNextHubPage}
            onOpenHub={(hubId) =>
              router.push(`/curior-services/${encodeURIComponent(serviceId)}/hubs/${encodeURIComponent(hubId)}`)
            }
          />
        )}

        {activeTab === "admins" && (
          <AdminPage
            serviceId={serviceId}
            admins={admins}
            visibleAdmins={visibleAdmins}
            isLoading={isAdminsLoading}
            error={adminsError}
            safeAdminPage={safeAdminPage}
            totalAdminPages={totalAdminPages}
            isAddFormOpen={isAddFormOpen}
            isSubmitting={isSubmitting}
            submitError={submitError}
            submitMessage={submitMessage}
            formData={formData}
            onOpenAddForm={handleToggleAddForm}
            onCloseAddForm={handleToggleAddForm}
            onResetForm={resetForm}
            onPreviousPage={goToPreviousAdminPage}
            onNextPage={goToNextAdminPage}
            onSubmit={handleSubmit}
            onChange={handleChange}
          />
        )}
        {activeTab === "branding" && <BrandingTab serviceId={serviceId} />}
      </div>
    </main>
  );
}
