"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RegisterAdminPayload } from "@/features/admin/dto/admin.dto";
import type { AdminUser } from "@/features/admin/types/admin.types";

type AdminPageProps = {
  serviceId: string;
  admins: AdminUser[];
  visibleAdmins: AdminUser[];
  isLoading: boolean;
  error: string | null;
  safeAdminPage: number;
  totalAdminPages: number;
  isAddFormOpen: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  submitMessage: string | null;
  formData: RegisterAdminPayload;
  onOpenAddForm: () => void;
  onCloseAddForm: () => void;
  onResetForm: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onChange: <K extends keyof RegisterAdminPayload>(key: K, value: RegisterAdminPayload[K]) => void;
};

function displayValue(value?: string | null): string {
  return value?.trim() || "-";
}

export default function AdminPage({
  serviceId,
  admins,
  visibleAdmins,
  isLoading,
  error,
  safeAdminPage,
  totalAdminPages,
  isAddFormOpen,
  isSubmitting,
  submitError,
  submitMessage,
  formData,
  onOpenAddForm,
  onCloseAddForm,
  onResetForm,
  onPreviousPage,
  onNextPage,
  onSubmit,
  onChange,
}: AdminPageProps) {
  return (
    <>
      <Card className="border-slate-200 bg-white">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg">Admin Users</CardTitle>
            <CardDescription>Admin users for this courier service.</CardDescription>
          </div>
          <Button onClick={onOpenAddForm}>Add New Admin</Button>
        </CardHeader>
        <CardContent>
          {!serviceId ? (
            <p className="text-sm text-slate-500">Invalid courier service.</p>
          ) : isLoading ? (
            <p className="text-sm text-slate-500">Loading admin users...</p>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : admins.length === 0 ? (
            <p className="text-sm text-slate-500">No admin users found for this courier service.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleAdmins.map((admin, index) => (
                    <TableRow key={displayValue(admin.id) === "-" ? `${index}-${displayValue(admin.name)}` : admin.id}>
                      <TableCell className="font-semibold text-slate-900">{displayValue(admin.name)}</TableCell>
                      <TableCell>{displayValue(admin.phone)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 flex items-center justify-end gap-2">
                <Button variant="outline" size="sm" disabled={isLoading || safeAdminPage <= 1} onClick={onPreviousPage}>
                  Previous
                </Button>
                <span className="text-sm text-slate-600">Page {safeAdminPage} of {totalAdminPages}</span>
                <Button variant="outline" size="sm" disabled={isLoading || safeAdminPage >= totalAdminPages} onClick={onNextPage}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isAddFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-xl border-slate-200 bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg">Add Curior Admin</CardTitle>
              <CardDescription>Creates a user record for this courier service.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={onSubmit} autoComplete="off">
                <div className="space-y-2">
                  <Label htmlFor="admin-name">Name</Label>
                  <Input id="admin-name" value={formData.name} placeholder="Name" onChange={(event) => onChange("name", event.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-phone">Phone</Label>
                  <Input id="admin-phone" value={formData.phone} placeholder="Phone No" onChange={(event) => onChange("phone", event.target.value)} required />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={formData.password}
                    placeholder="Password"
                    autoComplete="new-password"
                    onChange={(event) => onChange("password", event.target.value)}
                    required
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-3">
                  <Button type="submit" disabled={!formData.courierServiceId || isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Admin"}
                  </Button>
                  <Button type="button" disabled={isSubmitting} variant="outline" onClick={onResetForm}>
                    Reset
                  </Button>
                  <Button type="button" disabled={isSubmitting} variant="outline" onClick={onCloseAddForm}>
                    Close
                  </Button>
                </div>
              </form>

              {submitMessage && (
                <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3">
                  <p className="text-sm font-semibold text-emerald-700">{submitMessage}</p>
                </div>
              )}

              {submitError && (
                <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3">
                  <p className="text-sm font-semibold text-red-700">{submitError}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
