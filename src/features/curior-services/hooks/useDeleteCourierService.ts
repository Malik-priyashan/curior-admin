"use client";

import { useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { deleteCourierService } from "@/features/curior-services/api/couriorapi";

type UseDeleteOptions = {
  refreshAction: () => Promise<void>;
};

export function useDeleteCourierService({ refreshAction }: UseDeleteOptions) {
  const { data: session } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [targetName, setTargetName] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const open = useCallback((id: string, name?: string | null) => {
    setError(null);
    setTargetId(id);
    setTargetName(name ?? null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    if (isDeleting) return;
    setIsOpen(false);
    setTargetId(null);
    setTargetName(null);
    setError(null);
  }, [isDeleting]);

  const confirm = useCallback(async () => {
    if (!targetId) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteCourierService(targetId, session?.accessToken);
      setSuccess("Courier service deleted successfully");
      setIsOpen(false);
      setTargetId(null);
      setTargetName(null);
      await refreshAction();
      window.setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsDeleting(false);
    }
  }, [targetId, session?.accessToken, refreshAction]);

  return {
    isOpen,
    targetId,
    targetName,
    isDeleting,
    error,
    success,
    open,
    close,
    confirm,
  } as const;
}
