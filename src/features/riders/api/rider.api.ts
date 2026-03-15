import type { PaginationQuery } from "../../curior-services/types/courior-service.types";
import { normalizeRiderListResponse } from "../dto/rider.dto";
import type { Rider, RiderListResponse } from "../types/rider.types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

type RiderQuery = PaginationQuery & { hubId?: string };

export async function getRiders(
	courierServiceId: string,
	query: RiderQuery = {},
	accessToken?: string
): Promise<RiderListResponse> {
	const page = query.page ?? DEFAULT_PAGE;
	const limit = query.limit ?? DEFAULT_LIMIT;
	const hubId = query.hubId?.trim();

	const params = new URLSearchParams({
		page: String(page),
		limit: String(limit),
		courierServiceId,
	});
	if (hubId) params.set("hubId", hubId);

	const response = await fetch(`/api/backend/rider?${params.toString()}`, {
		cache: "no-store",
		headers: {
			...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
			"x-tenant-id": courierServiceId,
			"x-tenant": courierServiceId,
			"x-courier-service-id": courierServiceId,
			tenantId: courierServiceId,
			courierServiceId,
		},
	});

	if (!response.ok) {
		throw new Error(
			hubId
				? "Failed to fetch riders for the selected hub"
				: "Failed to fetch riders for the selected courier service"
		);
	}

	return normalizeRiderListResponse((await response.json()) as { data?: Rider[] }, page, limit, hubId);
}
