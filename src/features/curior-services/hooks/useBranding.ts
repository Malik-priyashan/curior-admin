"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import type { Branding } from "@/features/curior-services/types/courior-service.types";
import {
  getBrandingByCourierServiceId,
  createBranding,
  updateBranding,
} from "@/features/curior-services/api/couriorapi";

export function normalizeImageUrl(value?: string | null): string | null {
  const safe = value?.trim();
  if (!safe) return null;
  if (
    safe.startsWith("http://") ||
    safe.startsWith("https://") ||
    safe.startsWith("/")
  ) {
    return safe;
  }
  return `https://${safe}`;
}

export function useBranding(serviceId: string) {
  const [branding, setBranding] = useState<Branding | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const originalRef = useRef<Branding | null>(null);

  const DRAFT_KEY = `branding-draft:${serviceId}`;

  const { data: session } = useSession();

  useEffect(() => {
    async function loadBranding() {
      try {
        setLoading(true);
        const accessToken = session?.accessToken;

        const res = await getBrandingByCourierServiceId(serviceId, accessToken);
        originalRef.current = res ?? null;

          try {
            const draft = sessionStorage.getItem(DRAFT_KEY);
            if (draft) {
              const parsed = JSON.parse(draft) as Branding;
              setBranding(parsed);
              setEditing(true);
              return;
            }
          } catch {
            // ignore storage errors
          }

        if (res && res.businessName) {
          setBranding(res);
        } else {
          setBranding(null);
        }
      } catch {
        console.error("Failed to load branding");
        setBranding(null);
      } finally {
        setLoading(false);
      }
    }

    // Run only once on mount — avoid automatic refreshes when session/serviceId changes.
    // This ensures branding is only re-fetched on full page refresh.
    loadBranding();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function saveDraft(value: Branding | null) {
    try {
      if (!value) return sessionStorage.removeItem(DRAFT_KEY);
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(value));
    } catch {
      // ignore
    }
  }

  function clearDraft() {
    try {
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
  }

  function updateField(path: string, value: string) {
    setBranding((prev) => {
      const next = (prev ? { ...prev } : { colors: { accent: "", primary: "", secondary: "" } }) as Branding;

      const parts = path.split(".");
      let cur: Record<string, unknown> = next as unknown as Record<string, unknown>;

      for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i];
        if (cur[p] == null || typeof cur[p] !== "object") cur[p] = {};
        cur = cur[p] as Record<string, unknown>;
      }

      cur[parts[parts.length - 1]] = value;
      try {
        saveDraft(next);
      } catch {
        // ignore
      }

      return next;
    });
  }

  async function handleSave() {
    if (!branding) return;

    if (!branding.businessName?.trim()) {
      setMessage("Business Name is required.");
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const accessToken = session?.accessToken;

      const existing = await getBrandingByCourierServiceId(serviceId, accessToken);

      if (existing && existing.businessName) {
        await updateBranding(serviceId, branding, accessToken);
        setMessage("Branding updated successfully");
      } else {
        await createBranding(serviceId, branding, accessToken);
        setMessage("Branding created successfully");
      }

      const fresh = await getBrandingByCourierServiceId(serviceId, accessToken);
      clearDraft();
      originalRef.current = fresh ?? null;
      setBranding(fresh ?? null);
      setEditing(false);
    } catch (e) {
      console.error(e);
      const err = e as unknown;
      setMessage(err instanceof Error ? err.message : String(err) || "Failed to save branding");
    } finally {
      setSaving(false);
    }
  }

  function cancelEdit() {
    clearDraft();
    setEditing(false);
    setBranding(originalRef.current ?? null);
  }

  return {
    branding,
    setBranding,
    loading,
    saving,
    editing,
    message,
    setEditing,
    updateField,
    handleSave,
    cancelEdit,
    normalizeImageUrl,
  } as const;
}
