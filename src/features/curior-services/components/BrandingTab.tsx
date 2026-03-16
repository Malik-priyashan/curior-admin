"use client";

import Image from "next/image";
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
    editing,
    message,
    setEditing,
    updateField,
    handleSave,
    cancelEdit,
  } = useBranding(serviceId);

  const hasBranding =
    branding !== null &&
    (!!branding.businessName?.trim() ||
      !!branding.logoUrl?.trim() ||
      !!branding.colors?.accent?.trim() ||
      !!branding.colors?.primary?.trim() ||
      !!branding.colors?.secondary?.trim());

  const logoUrl = normalizeImageUrl(branding?.logoUrl);

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
            {logoUrl && !editing ? (
              <div className="mt-2 space-y-2">
                <a
                  href={logoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 underline break-all"
                >
                  {logoUrl}
                </a>
                <div className="h-20 w-20 rounded-md border border-slate-200 bg-white p-1">
                  <Image
                    src={logoUrl}
                    alt="Brand logo preview"
                    width={80}
                    height={80}
                    className="rounded-md object-contain"
                  />
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