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
import type { Merchant } from "@/features/merchants/types/merchant.types";

type MerchantsPageProps = {
  serviceId: string;
  merchants: Merchant[];
  isLoading: boolean;
  error: string | null;
  merchantPage: number;
  merchantTotal: number;
  totalMerchantPages: number;
  hasNextMerchantPage: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
};

function displayValue(value?: string | null): string {
  return value?.trim() || "-";
}

function getMerchantName(merchant: Merchant): string {
  return displayValue(merchant.name ?? merchant.shopName ?? merchant.businessName);
}

function getMerchantPhone(merchant: Merchant): string {
  return displayValue(merchant.phone ?? merchant.phone1 ?? merchant.ownerPhone);
}

export default function MerchantsPage({
  serviceId,
  merchants,
  isLoading,
  error,
  merchantPage,
  merchantTotal,
  totalMerchantPages,
  hasNextMerchantPage,
  onPreviousPage,
  onNextPage,
}: MerchantsPageProps) {
  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader>
        <CardTitle className="text-lg">Merchants</CardTitle>
        <CardDescription>Merchants related to this courier service.</CardDescription>
      </CardHeader>
      <CardContent>
        {!serviceId ? (
          <p className="text-sm text-slate-500">Invalid courier service.</p>
        ) : isLoading ? (
          <p className="text-sm text-slate-500">Loading merchants...</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : merchants.length === 0 ? (
          <p className="text-sm text-slate-500">No merchants found for this courier service.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Merchant Name</TableHead>
                  <TableHead>Phone No</TableHead>
                  <TableHead>Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {merchants.map((merchant, index) => (
                  <TableRow
                    key={displayValue(merchant.id) === "-" ? `${index}-${getMerchantName(merchant)}` : merchant.id}
                  >
                    <TableCell className="font-semibold text-slate-900">{getMerchantName(merchant)}</TableCell>
                    <TableCell>{getMerchantPhone(merchant)}</TableCell>
                    <TableCell>{displayValue(merchant.address)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" disabled={isLoading || merchantPage <= 1} onClick={onPreviousPage}>
                Previous
              </Button>
              <span className="text-sm text-slate-600">
                Page {merchantPage}{merchantTotal > 0 ? ` of ${totalMerchantPages}` : ""}
              </span>
              <Button variant="outline" size="sm" disabled={isLoading || !hasNextMerchantPage} onClick={onNextPage}>
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
