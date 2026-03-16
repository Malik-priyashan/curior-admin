"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useCouriorServiceRequestsPage, {
  displayValue,
  requestDate,
  requestStatus,
  canApprove,
} from "@/features/curior-services/hooks/useCouriorServiceRequestsPage";

export default function CouriorServiceRequestsPage() {
  const router = useRouter();
  const {
    isLoading,
    error,
    refresh,
    visibleRequests,
    visibleCount,
    recalculatedTotalPages,
    safeCurrentPage,
    setPage,
    approvingId,
    approvedIds,
    rejectedIds,
    actionMessage,
    actionError,
    onApprove,
    onReject,
  } = useCouriorServiceRequestsPage();

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
            ) : visibleCount === 0 ? (
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
                          <TableCell>{requestStatus(request, approvedIds, rejectedIds)}</TableCell>
                          <TableCell>{requestDate(request)}</TableCell>
                          <TableCell>{displayValue(request.address)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                onClick={() => onApprove(request.id)}
                                disabled={!request.id?.trim() || approvingId === request.id?.trim() || !canApprove(request, approvedIds, rejectedIds)}
                              >
                                {approvingId === request.id?.trim() ? "Accepting..." : "Accept"}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onReject(request.id)}
                                disabled={!request.id?.trim() || rejectedIds.includes(request.id?.trim() ?? "")}
                              >
                                Reject
                              </Button>
                            </div>
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
