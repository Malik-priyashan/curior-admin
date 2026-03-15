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
import type { Hub } from "@/features/hubs/types/hub.types";

type HubsPageProps = {
  serviceId: string;
  hubs: Hub[];
  isLoading: boolean;
  error: string | null;
  hubPage: number;
  hubTotal: number;
  totalHubPages: number;
  hasNextHubPage: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onOpenHub: (hubId: string) => void;
};

function displayValue(value?: string | null): string {
  return value?.trim() || "-";
}

function getHubPhone1(hub: Hub): string {
  return displayValue(hub.phone1);
}

function getHubManagerName(hub: Hub): string {
  return displayValue(hub.managerName);
}

function getHubManagerPhone(hub: Hub): string {
  return displayValue(hub.managerPhone);
}

export default function HubsPage({
  serviceId,
  hubs,
  isLoading,
  error,
  hubPage,
  hubTotal,
  totalHubPages,
  hasNextHubPage,
  onPreviousPage,
  onNextPage,
  onOpenHub,
}: HubsPageProps) {
  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader>
        <CardTitle className="text-lg">Hubs</CardTitle>
        <CardDescription>Hubs related to this courier service. Click a hub to view its riders.</CardDescription>
      </CardHeader>
      <CardContent>
        {!serviceId ? (
          <p className="text-sm text-slate-500">Invalid courier service.</p>
        ) : isLoading ? (
          <p className="text-sm text-slate-500">Loading hubs...</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : hubs.length === 0 ? (
          <p className="text-sm text-slate-500">No hubs found for this courier service.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>City</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Phone 1</TableHead>
                  <TableHead>Manager Name</TableHead>
                  <TableHead>Manager Phone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hubs.map((hub, index) => (
                  <TableRow
                    key={displayValue(hub.id) === "-" ? `${index}-${displayValue(hub.name)}` : hub.id}
                    className="cursor-pointer transition-colors hover:bg-slate-50"
                    role="button"
                    tabIndex={0}
                    onClick={() => onOpenHub(hub.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onOpenHub(hub.id);
                      }
                    }}
                  >
                    <TableCell>{displayValue(hub.city)}</TableCell>
                    <TableCell>{displayValue(hub.address)}</TableCell>
                    <TableCell>{getHubPhone1(hub)}</TableCell>
                    <TableCell>{getHubManagerName(hub)}</TableCell>
                    <TableCell>{getHubManagerPhone(hub)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" disabled={isLoading || hubPage <= 1} onClick={onPreviousPage}>
                Previous
              </Button>
              <span className="text-sm text-slate-600">
                Page {hubPage}{hubTotal > 0 ? ` of ${totalHubPages}` : ""}
              </span>
              <Button variant="outline" size="sm" disabled={isLoading || !hasNextHubPage} onClick={onNextPage}>
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
