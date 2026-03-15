"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CreateCourierServiceRequestPayload } from "@/features/curior-services/dto/courior-service.dto";

type CreateCourierServiceModalProps = {
  isOpen: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  form: CreateCourierServiceRequestPayload;
  onClose: () => void;
  onUpdateField: <K extends keyof CreateCourierServiceRequestPayload>(
    field: K,
    value: CreateCourierServiceRequestPayload[K]
  ) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

export default function CreateCourierServiceModal({
  isOpen,
  isSubmitting,
  submitError,
  form,
  onClose,
  onUpdateField,
  onSubmit,
}: CreateCourierServiceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <Card className="w-full max-w-2xl border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Add New Curior Service</CardTitle>
          <CardDescription>Submit a courier service request.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="serviceName">Service Name</Label>
                <Input
                  id="serviceName"
                  value={form.serviceName ?? ""}
                  onChange={(event) => onUpdateField("serviceName", event.target.value)}
                  placeholder="Enter courier service name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone1">Phone 1</Label>
                <Input
                  id="phone1"
                  value={form.phone1 ?? ""}
                  onChange={(event) => onUpdateField("phone1", event.target.value)}
                  placeholder="Primary phone"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone2">Phone 2</Label>
                <Input
                  id="phone2"
                  value={form.phone2 ?? ""}
                  onChange={(event) => onUpdateField("phone2", event.target.value)}
                  placeholder="Secondary phone"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="directorName">Director Name</Label>
                <Input
                  id="directorName"
                  value={form.directorName ?? ""}
                  onChange={(event) => onUpdateField("directorName", event.target.value)}
                  placeholder="Director full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="directorPhone">Director Phone</Label>
                <Input
                  id="directorPhone"
                  value={form.directorPhone ?? ""}
                  onChange={(event) => onUpdateField("directorPhone", event.target.value)}
                  placeholder="Director phone number"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="directorEmail">Director Email</Label>
                <Input
                  id="directorEmail"
                  type="email"
                  value={form.directorEmail ?? ""}
                  onChange={(event) => onUpdateField("directorEmail", event.target.value)}
                  placeholder="director@email.com"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={form.address ?? ""}
                  onChange={(event) => onUpdateField("address", event.target.value)}
                  placeholder="Service address"
                />
              </div>
            </div>

            {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
