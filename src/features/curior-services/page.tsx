"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ServiceListCard from "@/features/curior-services/components/ServiceListCard";
import { useDeleteCourierService } from "@/features/curior-services/hooks/useDeleteCourierService";
import DeleteConfirmationModal from "@/features/curior-services/components/DeleteConfirmationModal";
import CreateCourierServiceModal from "@/features/curior-services/components/CreateCourierServiceModal";
import { useCouriorServices } from "@/features/curior-services/hooks/useCouriorServices";
import { useCreateCourierServiceRequest } from "@/features/curior-services/hooks/useCreateCourierServiceRequest";

const PAGE_SIZE = 10;

export default function CuriorServicesPage() {
  const router = useRouter();
  const { services, isLoading, error, refresh } = useCouriorServices();
  const {
    form,
    isCreateOpen,
    isSubmitting,
    submitError,
    submitSuccess,
    updateField,
    openCreateModal,
    closeCreateModal,
    onSubmitCreate,
  } = useCreateCourierServiceRequest({ refreshAction: refresh });

  const [servicesPage, setServicesPage] = useState(1);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteHook = useDeleteCourierService({ refreshAction: refresh });

  const totalServicesPages = Math.max(1, Math.ceil(services.length / PAGE_SIZE));
  const safeServicesPage = Math.min(servicesPage, totalServicesPages);
  const serviceStart = (safeServicesPage - 1) * PAGE_SIZE;
  const visibleServices = services.slice(serviceStart, serviceStart + PAGE_SIZE);

  function handleSelectService(serviceId: string) {
    router.push(`/curior-services/${encodeURIComponent(serviceId)}`);
  }

  function handleDeleteService(serviceId: string, serviceName?: string | null) {
    deleteHook.open(serviceId, serviceName ?? null);
  }

  return (
    <main className="h-screen overflow-y-auto bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900">Curior Services</h1>
            <p className="text-sm text-slate-500">All available courier service providers.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={openCreateModal}>Add New Curior Service</Button>
            <Button variant="outline" onClick={() => router.push("/curior-services/requests")}>
              View Service Requests
            </Button>
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </header>

        {submitSuccess ? (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {submitSuccess}
          </div>
        ) : null}

        {submitError && !isCreateOpen ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {submitError}
          </div>
        ) : null}

        {deleteMessage ? (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {deleteMessage}
          </div>
        ) : null}

        {deleteError ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {deleteError}
          </div>
        ) : null}

        <ServiceListCard
          isLoading={isLoading}
          error={error}
          services={services}
          visibleServices={visibleServices}
          safeServicesPage={safeServicesPage}
          totalServicesPages={totalServicesPages}
          onSelectService={handleSelectService}
          onDeleteService={(id: string, name?: string | null) => handleDeleteService(id, name)}
          onPreviousPage={() => setServicesPage((prev) => Math.max(1, prev - 1))}
          onNextPage={() => setServicesPage((prev) => Math.min(totalServicesPages, prev + 1))}
        />

        <DeleteConfirmationModal
          isOpen={deleteHook.isOpen}
          isDeleting={deleteHook.isDeleting}
          error={deleteHook.error}
          targetName={deleteHook.targetName}
          onCancel={deleteHook.close}
          onConfirm={async () => {
            await deleteHook.confirm();
            if (deleteHook.success) setDeleteMessage(deleteHook.success);
            if (deleteHook.error) setDeleteError(deleteHook.error);
          }}
        />

        <CreateCourierServiceModal
          isOpen={isCreateOpen}
          isSubmitting={isSubmitting}
          submitError={submitError}
          form={form}
          onClose={closeCreateModal}
          onUpdateField={updateField}
          onSubmit={onSubmitCreate}
        />
      </div>
    </main>
  );
}
