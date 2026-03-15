"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import {
  createCourierServiceRequest,
  getCouriorServices,
} from "@/features/curior-services/api/couriorapi";
import type { CreateCourierServiceRequestPayload } from "@/features/curior-services/dto/courior-service.dto";

const INITIAL_FORM: CreateCourierServiceRequestPayload = {
  serviceName: "",
  phone1: "",
  phone2: "",
  directorName: "",
  directorEmail: "",
  directorPhone: "",
  address: "",
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type UseCreateCourierServiceRequestOptions = {
  refreshAction: () => Promise<void>;
};

export function useCreateCourierServiceRequest({
  refreshAction,
}: UseCreateCourierServiceRequestOptions) {
  const { data: session } = useSession();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [form, setForm] = useState<CreateCourierServiceRequestPayload>(INITIAL_FORM);

  useEffect(() => {
    if (!submitSuccess) return;
    const timeoutId = setTimeout(() => setSubmitSuccess(null), 3000);
    return () => clearTimeout(timeoutId);
  }, [submitSuccess]);

  function updateField<K extends keyof CreateCourierServiceRequestPayload>(
    field: K,
    value: CreateCourierServiceRequestPayload[K]
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function openCreateModal() {
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsCreateOpen(true);
  }

  function closeCreateModal() {
    if (isSubmitting) return;
    setIsCreateOpen(false);
    setForm(INITIAL_FORM);
    setSubmitError(null);
  }

  async function onSubmitCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!form.serviceName?.trim()) {
      setSubmitError("Courier service name is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await createCourierServiceRequest(form, session?.accessToken);

      const createdId = response.data?.id?.trim();
      let isSavedInCourierServiceTable = false;

      for (let attempt = 0; attempt < 3 && !isSavedInCourierServiceTable; attempt += 1) {
        const latestServices = await getCouriorServices(session?.accessToken);
        isSavedInCourierServiceTable = createdId
          ? latestServices.some((service) => service.id === createdId)
          : latestServices.some(
              (service) =>
                service.serviceName?.trim().toLowerCase() ===
                  form.serviceName?.trim().toLowerCase() &&
                (service.phone1?.trim() || "") === (form.phone1?.trim() || "")
            );

        if (!isSavedInCourierServiceTable && attempt < 2) {
          await wait(700);
        }
      }

      setSubmitSuccess(
        isSavedInCourierServiceTable
          ? "Courier service saved in CourierService table successfully."
          : "Request submitted successfully. Service may appear in list after backend approval/sync."
      );

      setIsCreateOpen(false);
      setForm(INITIAL_FORM);
      await refreshAction();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to create courier service request");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    form,
    isCreateOpen,
    isSubmitting,
    submitError,
    submitSuccess,
    setSubmitError,
    updateField,
    openCreateModal,
    closeCreateModal,
    onSubmitCreate,
  };
}
