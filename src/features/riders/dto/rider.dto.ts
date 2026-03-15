export type RiderQueryDto = {
	page?: number;
	limit?: number;
	hubId?: string;
};

import type { Rider, RiderListResponse } from "../types/rider.types";

type RawRiderListPayload = {
	data?: Rider[];
	items?: Rider[];
	results?: Rider[];
	result?: {
		data?: Rider[];
		items?: Rider[];
		results?: Rider[];
		total?: number;
		page?: number;
		limit?: number;
	};
	total?: number;
	page?: number;
	limit?: number;
};

export function normalizeRiderListResponse(
	payload: RawRiderListPayload,
	page: number,
	limit: number,
	hubId?: string
): RiderListResponse {
	const num = (value: unknown): number | undefined =>
		typeof value === "number" && Number.isFinite(value) ? value : undefined;
	const rows =
		payload.data ??
		payload.items ??
		payload.results ??
		payload.result?.data ??
		payload.result?.items ??
		payload.result?.results ??
		[];

	return {
		data: hubId ? rows.filter((rider) => rider.hubId === hubId) : rows,
		total: num(payload.total) ?? num(payload.result?.total),
		page: num(payload.page) ?? num(payload.result?.page) ?? page,
		limit: num(payload.limit) ?? num(payload.result?.limit) ?? limit,
	};
}
