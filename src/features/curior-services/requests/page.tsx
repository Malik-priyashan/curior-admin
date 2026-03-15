"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { approveCouriorServiceRequest } from "@/features/curior-services/api/couriorapi";
import { useCouriorServiceRequests } from "@/features/curior-services/hooks/useCouriorServiceRequests";
import { addApprovedServiceToCache } from "@/features/curior-services/lib/approved-services-cache";
import type { CouriorServiceRequest } from "@/features/curior-services/types/courior-service.types";
import { useSession } from "next-auth/react";

const PAGE_SIZE = 10;

function displayValue(value?: string | null): string {
  return value?.trim() || "-";
}

function requestStatus(request: CouriorServiceRequest): string {
  return request.approved ? "Approved" : "Not Approved";
}

function canApprove(request: CouriorServiceRequest): boolean {
  return request.approved !== true;
}

function requestDate(request: CouriorServiceRequest): string {
  const raw = request.createdAt ?? request.requestedAt;
  if (!raw?.trim()) return "-";

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;

  return new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function CouriorServiceRequestsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { requests, isLoading, error, refresh } = useCouriorServiceRequests();
  const [page, setPage] = useState(1);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [removedRequestIds, setRemovedRequestIds] = useState<string[]>([]);

  useEffect(() => {
    if (!actionMessage && !actionError) return;
    const timeoutId = setTimeout(() => {
      setActionMessage(null);
      setActionError(null);
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [actionMessage, actionError]);

  async function onApprove(requestId: string) {
    try {
      setApprovingId(requestId);
      setActionError(null);
      const response = await approveCouriorServiceRequest(requestId, session?.accessToken);
      addApprovedServiceToCache(response.data);
      setRemovedRequestIds((prev) => (prev.includes(requestId) ? prev : [...prev, requestId]));
      setActionMessage(response.message || "Courier service request approved successfully");
      await refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to approve courier service request");
    } finally {
      setApprovingId(null);
    }
  }

  const visibleData = requests.filter((request) => !removedRequestIds.includes(request.id));
  const recalculatedTotalPages = Math.max(1, Math.ceil(visibleData.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(page, recalculatedTotalPages);
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
  const visibleRequests = visibleData.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <main className="h-screen overflow-y-auto bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900">Curior Service Requests</h1>
            <p className="text-sm text-slate-500">All incoming courier service registration requests.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={refresh}>Refresh</Button>
            <Button variant="outline" onClick={() => router.push("/curior-services")}>Back to Curior Services</Button>
          </div>
        </header>

        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Requests List</CardTitle>
            
          </CardHeader>
          <CardContent>
            {actionMessage ? (
              <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {actionMessage}
              </div>
            ) : null}

            {actionError ? (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {actionError}
              </div>
            ) : null}

            {isLoading ? (
              <p className="text-sm text-slate-500">Loading requests...</p>
            ) : error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : visibleData.length === 0 ? (
              <p className="text-sm text-slate-500">No courier service requests found.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Director</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requested At</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleRequests.map((request, index) => {
                      const key = request.id?.trim() || `${request.serviceName}-${index}`;

                      return (
                        <TableRow key={key}>
                          <TableCell className="font-semibold text-slate-900">{displayValue(request.serviceName)}</TableCell>
                          <TableCell>{displayValue(request.phone1 ?? request.directorPhone)}</TableCell>
                          <TableCell>{displayValue(request.directorName)}</TableCell>
                          <TableCell>{requestStatus(request)}</TableCell>
                          <TableCell>{requestDate(request)}</TableCell>
                          <TableCell>{displayValue(request.address)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              onClick={() => onApprove(request.id)}
                              disabled={!request.id?.trim() || approvingId === request.id || !canApprove(request)}
                            >
                              {approvingId === request.id ? "Approving..." : "Approve"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                <div className="mt-4 flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" disabled={safeCurrentPage <= 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
                    Previous
                  </Button>
                  <span className="text-sm text-slate-600">
                    Page {safeCurrentPage} of {recalculatedTotalPages}
                  </span>
                  <Button variant="outline" size="sm" disabled={safeCurrentPage >= recalculatedTotalPages} onClick={() => setPage((prev) => Math.min(recalculatedTotalPages, prev + 1))}>
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
