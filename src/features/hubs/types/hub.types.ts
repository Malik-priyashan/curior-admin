export interface Hub {
  id: string;
  name?: string | null;
  city?: string | null;
  address?: string | null;
  phone1?: string | null;
  phone2?: string | null;
  managerName?: string | null;
  managerPhone?: string | null;
  managerEmail?: string | null;
  courierServiceId?: string | null;
}

export interface HubListResponse {
  data: Hub[];
  total?: number;
  page?: number;
  limit?: number;
}
