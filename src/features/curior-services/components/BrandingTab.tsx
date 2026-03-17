"use client";

import Image from "next/image";
// react hooks are used via custom hook; no direct React imports needed here
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBranding, normalizeImageUrl } from "@/features/curior-services/hooks/useBranding";

type Props = {
  serviceId: string;
};

export default function BrandingTab({ serviceId }: Props) {
  const {
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
    uploadImage,
    getDisplayName,
    isDataUrl,
  } = useBranding(serviceId);

  const hasBranding =
    branding !== null &&
    (!!branding.businessName?.trim() ||
      !!branding.logoUrl?.trim() ||
      !!branding.colors?.accent?.trim() ||
      !!branding.colors?.primary?.trim() ||
      !!branding.colors?.secondary?.trim());

  const logoUrl = normalizeImageUrl(branding?.logoUrl);

  // image helpers and upload handled by hook
  // image helpers and upload handled by hook

  if (loading) {
    return (
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">Loading branding...</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Branding</h2>

        {hasBranding && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="p-1 border rounded hover:bg-slate-100"
          >
            ✏️
          </button>
        )}
      </div>

      {hasBranding ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="col-span-full">
            <Label>Business Name</Label>
            <Input
              value={branding?.businessName ?? ""}
              readOnly={!editing}
              onChange={(e) => updateField("businessName", e.target.value)}
            />
          </div>

          <div>
            <Label>Logo URL</Label>
            <Input
              value={branding?.logoUrl ?? ""}
              readOnly={!editing}
              onChange={(e) => updateField("logoUrl", e.target.value)}
            />
            {editing ? (
              <div className="mt-2 flex items-center gap-2">
                <Label className="sr-only">Upload a logo</Label>
                {/* hidden file input triggered by the visible button */}
                <input
                  id={`branding-logo-file-${serviceId}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (!file) return;
                    uploadImage(file).catch(() => {
                      /* swallow errors — hook handles fallback */
                    });
                  }}
                  className="hidden"
                />

                <Button
                  type="button"
                  disabled={uploading}
                  onClick={() => {
                    const el = document.getElementById(`branding-logo-file-${serviceId}`) as HTMLInputElement | null;
                    el?.click();
                  }}
                >
                  {uploading ? "Uploading..." : "Upload Image"}
                </Button>

                <span className="text-sm text-slate-600">
                  {getDisplayName(branding?.logoUrl ?? undefined, branding?.logoFileName ?? undefined)}
                </span>
              </div>
            ) : null}
            {logoUrl && !editing ? (
              <div className="mt-2 space-y-2">
                <a
                  href={logoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 underline"
                  title={logoUrl}
                >
                  {getDisplayName(logoUrl, branding?.logoFileName)}
                </a>
                <div className="h-20 w-20 rounded-md border border-slate-200 bg-white p-1">
                  {isDataUrl(logoUrl) ? (
                    // Next/Image doesn't reliably support data URLs — use <img> for inline previews
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logoUrl ?? undefined}
                      alt="Brand logo preview"
                      width={80}
                      height={80}
                      className="rounded-md object-contain"
                    />
                  ) : (
                    <Image
                      src={logoUrl!}
                      alt="Brand logo preview"
                      width={80}
                      height={80}
                      className="rounded-md object-contain"
                    />
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {/* Colors grouped on the right column, stacked vertically */}
          <div className="flex flex-col gap-4">
            <div>
              <Label>Accent Color</Label>
              <Input
                type="color"
                value={branding?.colors?.accent ?? "#22c55e"}
                disabled={!editing}
                onChange={(e) => updateField("colors.accent", e.target.value)}
              />
            </div>

            <div>
              <Label>Primary Color</Label>
              <Input
                type="color"
                value={branding?.colors?.primary ?? "#ff4d4f"}
                disabled={!editing}
                onChange={(e) => updateField("colors.primary", e.target.value)}
              />
            </div>

            <div>
              <Label>Secondary Color</Label>
              <Input
                type="color"
                value={branding?.colors?.secondary ?? "#1f2937"}
                disabled={!editing}
                onChange={(e) => updateField("colors.secondary", e.target.value)}
              />
            </div>
          </div>

          {editing && (
            <div className="col-span-full flex gap-2 mt-2">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>

              <Button variant="outline" onClick={cancelEdit}>
                Cancel
              </Button>
            </div>
          )}

          {message && (
            <p className="col-span-full text-sm text-slate-600">{message}</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-sm text-slate-500 mb-4">No branding added yet</p>

          <Button
            onClick={() => {
              setBranding({
                businessName: "",
                logoUrl: "",
                colors: {
                  accent: "#22c55e",
                  primary: "#ff4d4f",
                  secondary: "#1f2937",
                },
              });
              setEditing(true);
            }}
          >
            Add Branding
          </Button>
        </div>
      )}
    </div>
  );
}