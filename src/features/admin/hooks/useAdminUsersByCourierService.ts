"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useSession } from "next-auth/react";

import { getAdminUsers, registerCuriorAdmin } from "@/features/admin/api/admin.api";
import type { RegisterAdminPayload } from "@/features/admin/dto/admin.dto";
import type { AdminUser } from "@/features/admin/types/admin.types";
import type { PaginationQuery } from "@/features/curior-services/types/courior-service.types";

const DEFAULT_QUERY: Required<PaginationQuery> = {
  page: 1,
  limit: 1000,
};

const PAGE_SIZE = 10;

const INITIAL_FORM_DATA: RegisterAdminPayload = {
  name: "",
  phone: "",
  password: "",
  role: "ADMIN",
  courierServiceId: "",
};

export function useAdminUsersByCourierService(courierServiceId?: string) {
  const { data: session } = useSession();

  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<RegisterAdminPayload>(INITIAL_FORM_DATA);
  const [adminPage, setAdminPage] = useState(1);

  const loadAdmins = useCallback(
    async (courierServiceId: string, query: PaginationQuery = DEFAULT_QUERY) => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getAdminUsers(query, session?.accessToken, courierServiceId);
        setAdmins(response.data);
      } catch (err) {
        setAdmins([]);
        setError(
          err instanceof Error ? err.message : "Failed to load admin users for selected courier service"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [session?.accessToken]
  );

  useEffect(() => {
    if (!courierServiceId) return;
    setAdminPage(1);
    setFormData((prev) => ({ ...prev, courierServiceId }));
    loadAdmins(courierServiceId);
  }, [courierServiceId, loadAdmins]);

  const totalAdminPages = Math.max(1, Math.ceil(admins.length / PAGE_SIZE));
  const safeAdminPage = Math.min(adminPage, totalAdminPages);
  const adminStart = (safeAdminPage - 1) * PAGE_SIZE;
  const visibleAdmins = admins.slice(adminStart, adminStart + PAGE_SIZE);

  function resetForm() {
    setFormData((prev) => ({ ...INITIAL_FORM_DATA, courierServiceId: prev.courierServiceId }));
    setSubmitError(null);
    setSubmitMessage(null);
  }

  function handleToggleAddForm() {
    setIsAddFormOpen((prev) => {
      const next = !prev;
      if (next) {
        setFormData((current) => ({ ...current, password: "" }));
      }
      return next;
    });
  }

  function handleChange<K extends keyof RegisterAdminPayload>(
    key: K,
    value: RegisterAdminPayload[K]
  ) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitMessage(null);

    try {
      await registerCuriorAdmin(formData);
      setSubmitMessage("Curior admin created successfully.");

      if (courierServiceId) {
        await loadAdmins(courierServiceId);
        setAdminPage(1);
      }

      setFormData((prev) => ({ ...INITIAL_FORM_DATA, courierServiceId: prev.courierServiceId }));
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to create curior admin");
    } finally {
      setIsSubmitting(false);
    }
  }

  function goToPreviousAdminPage() {
    setAdminPage((prev) => Math.max(1, prev - 1));
  }

  function goToNextAdminPage() {
    setAdminPage((prev) => Math.min(totalAdminPages, prev + 1));
  }

  return {
    admins,
    formData,
    goToNextAdminPage,
    goToPreviousAdminPage,
    handleChange,
    handleSubmit,
    handleToggleAddForm,
    isAddFormOpen,
    isLoading,
    isSubmitting,
    resetForm,
    safeAdminPage,
    submitError,
    submitMessage,
    totalAdminPages,
    visibleAdmins,
    error,
    loadAdmins,
  };
}
