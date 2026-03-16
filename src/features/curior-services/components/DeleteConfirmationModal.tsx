"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type Props = {
  isOpen: boolean;
  isDeleting: boolean;
  error: string | null;
  targetName?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmationModal({
  isOpen,
  isDeleting,
  error,
  targetName,
  onCancel,
  onConfirm,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <Card className="w-full max-w-md border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Confirm Delete</CardTitle>
          <CardDescription>Are you sure you want to delete this courier service?</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-slate-700">{targetName ? `Service: ${targetName}` : null}</p>
          {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isDeleting}>
              Cancel
            </Button>
            <Button type="button" onClick={onConfirm} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
