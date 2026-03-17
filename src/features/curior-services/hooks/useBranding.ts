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
    safe.startsWith("/") ||
    safe.startsWith("data:")
  ) {
    return safe;
  }
  return `https://${safe}`;
}

export function useBranding(serviceId: string) {
  const [branding, setBranding] = useState<Branding | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
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

  const isDataUrl = (u?: string | null) => !!u && u.startsWith("data:");

  const getDisplayName = (url?: string | null, fileName?: string | null) => {
    if (fileName && fileName.trim()) return fileName;
    if (!url) return "";
    if (isDataUrl(url)) {
      const m = url.match(/^data:([^;]+);/);
      if (m && m[1]) {
        const parts = m[1].split("/");
        const ext = parts[1] ?? "img";
        return `uploaded-image.${ext}`;
      }
      return "uploaded-image";
    }
    try {
      const u = new URL(url, window.location.origin);
      const path = u.pathname.split("/").filter(Boolean).pop() ?? "image";
      return decodeURIComponent(path);
    } catch {
      const parts = url.split("/");
      return parts.pop() ?? url;
    }
  };

  async function uploadImage(file: File) {
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    const dataUrl: string = await new Promise((resolve) => {
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.readAsDataURL(file);
    });

    try {
      const resp = await fetch("/api/cloudinary/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl, filename: file.name, serviceId, businessName: branding?.businessName ?? undefined }),
      });
      const json = await resp.json();
      if (resp.ok && json.url) {
        updateField("logoUrl", json.url);
        updateField("logoFileName", file.name);
      } else {
        // fallback to inline data URL if upload failed
        updateField("logoUrl", dataUrl);
        updateField("logoFileName", file.name);
      }
    } catch {
      // fallback on error
      updateField("logoUrl", dataUrl);
      updateField("logoFileName", file.name);
    } finally {
      setUploading(false);
    }
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
    uploading,
    editing,
    message,
    setEditing,
    updateField,
    handleSave,
    cancelEdit,
    normalizeImageUrl,
    isDataUrl,
    getDisplayName,
    uploadImage,
  } as const;
}
