import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { CouriorService } from "@/features/curior-services/types/courior-service.types";

type ServiceListCardProps = {
  isLoading: boolean;
  error: string | null;
  services: CouriorService[];
  visibleServices: CouriorService[];
  safeServicesPage: number;
  totalServicesPages: number;
  onSelectService: (serviceId: string) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
};

function displayValue(value?: string | null): string {
  return value?.trim() || "-";
}

function normalizeImageUrl(value?: string | null): string | null {
  const safe = value?.trim();
  if (!safe) return null;
  if (safe.startsWith("http://") || safe.startsWith("https://") || safe.startsWith("/")) {
    return safe;
  }
  return `https://${safe}`;
}

export default function ServiceListCard({
  isLoading,
  error,
  services,
  visibleServices,
  safeServicesPage,
  totalServicesPages,
  onSelectService,
  onPreviousPage,
  onNextPage,
}: ServiceListCardProps) {
  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader>
        <CardTitle className="text-lg">Service List</CardTitle>
        <CardDescription>Click a courier service to open the service details page.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading curior services...</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : services.length === 0 ? (
          <p className="text-sm text-slate-500">No curior services available.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Courier Service Name</TableHead>
                  <TableHead>Branding</TableHead>
                  <TableHead>Phone No</TableHead>
                  <TableHead>Director Name</TableHead>
                  <TableHead>Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleServices.map((service, index) => {
                  const rowKey = displayValue(service.id);
                  const logoUrl = normalizeImageUrl(
                    service.branding?.logoUrl ?? (service.branding as { logo?: string | null } | undefined)?.logo
                  );

                  return (
                    <TableRow
                      key={rowKey === "-" ? String(index) : rowKey}
                      className="cursor-pointer transition-colors hover:bg-slate-50"
                      role="button"
                      tabIndex={0}
                      onClick={() => onSelectService(service.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          onSelectService(service.id);
                        }
                      }}
                    >
                      <TableCell className="font-semibold text-slate-900">
                        {displayValue(service.serviceName)}
                      </TableCell>
                      <TableCell>
                        {logoUrl ? (
                          <div className="h-8 w-8 rounded-md border border-slate-200 bg-white p-0.5">
                            <Image
                              src={logoUrl}
                              alt={service.branding?.businessName ?? "logo"}
                              width={32}
                              height={32}
                              className="rounded-md object-contain"
                            />
                          </div>
                        ) : (
                          displayValue(service.branding?.businessName ?? undefined)
                        )}
                      </TableCell>
                      <TableCell>{displayValue(service.phone1 ?? service.directorPhone)}</TableCell>
                      <TableCell>{displayValue(service.directorName)}</TableCell>
                      <TableCell>{displayValue(service.address)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <div className="mt-4 flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" disabled={safeServicesPage <= 1} onClick={onPreviousPage}>
                Previous
              </Button>
              <span className="text-sm text-slate-600">
                Page {safeServicesPage} of {totalServicesPages}
              </span>
              <Button variant="outline" size="sm" disabled={safeServicesPage >= totalServicesPages} onClick={onNextPage}>
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
