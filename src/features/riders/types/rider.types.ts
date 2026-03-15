export interface Rider {
	id: string;
	firstName?: string | null;
	lastName?: string | null;
	phone?: string | null;
	nationalId?: string | null;
	vehicleNumber?: string | null;
	status?: string | null;
	hubId?: string | null;
	courierServiceId?: string | null;
}

export interface RiderListResponse {
	data: Rider[];
	total?: number;
	page?: number;
	limit?: number;
}
