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
import type { Rider } from "@/features/riders/types/rider.types";

type RidersPageProps = {
	serviceId: string;
	hubId?: string;
	riders: Rider[];
	isLoading: boolean;
	error: string | null;
	riderPage: number;
	riderTotal: number;
	totalRiderPages: number;
	hasNextRiderPage: boolean;
	onPreviousPageAction: () => void;
	onNextPageAction: () => void;
};

function displayValue(value?: string | null): string {
	return value?.trim() || "-";
}

function getRiderFullName(rider: Rider): string {
	const firstName = rider.firstName?.trim() ?? "";
	const lastName = rider.lastName?.trim() ?? "";
	const fullName = `${firstName} ${lastName}`.trim();
	return fullName || "-";
}

export default function RidersPage({
	serviceId,
	hubId,
	riders,
	isLoading,
	error,
	riderPage,
	riderTotal,
	totalRiderPages,
	hasNextRiderPage,
	onPreviousPageAction,
	onNextPageAction,
}: RidersPageProps) {
	return (
		<Card className="border-slate-200 bg-white">
			<CardHeader>
				<CardTitle className="text-lg">Riders</CardTitle>
				<CardDescription>
					{hubId
						? "Riders related to this hub."
						: "Riders related to this courier service."}
				</CardDescription>
			</CardHeader>
			<CardContent>
				{!serviceId ? (
					<p className="text-sm text-slate-500">Invalid courier service.</p>
				) : isLoading ? (
					<p className="text-sm text-slate-500">Loading riders...</p>
				) : error ? (
					<p className="text-sm text-red-500">{error}</p>
				) : riders.length === 0 ? (
					<p className="text-sm text-slate-500">
						{hubId ? "No riders found for this hub." : "No riders found for this courier service."}
					</p>
				) : (
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Full Name</TableHead>
									<TableHead>Phone No</TableHead>
									<TableHead>National ID</TableHead>
									<TableHead>Vehicle No</TableHead>
									<TableHead>Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{riders.map((rider, index) => (
									<TableRow
										key={displayValue(rider.id) === "-" ? `${index}-${getRiderFullName(rider)}` : rider.id}
									>
										<TableCell className="font-semibold text-slate-900">{getRiderFullName(rider)}</TableCell>
										<TableCell>{displayValue(rider.phone)}</TableCell>
										<TableCell>{displayValue(rider.nationalId)}</TableCell>
										<TableCell>{displayValue(rider.vehicleNumber)}</TableCell>
										<TableCell>{displayValue(rider.status)}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>

						<div className="mt-4 flex items-center justify-end gap-2">
							<Button
								variant="outline"
								size="sm"
								disabled={isLoading || riderPage <= 1}
								onClick={onPreviousPageAction}
							>
								Previous
							</Button>
							<span className="text-sm text-slate-600">
								Page {riderPage}{riderTotal > 0 ? ` of ${totalRiderPages}` : ""}
							</span>
							<Button
								variant="outline"
								size="sm"
								disabled={isLoading || !hasNextRiderPage}
								onClick={onNextPageAction}
							>
								Next
							</Button>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
