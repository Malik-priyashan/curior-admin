export interface CouriorService {
  id: string;
  serviceName: string;
  branding?: Branding | null;
  approved?: boolean | null;
  status?: string | null;
  requestStatus?: string | null;
  phone1?: string | null;
  phone2?: string | null;
  directorName?: string | null;
  directorEmail?: string | null;
  directorPhone?: string | null;
  address?: string | null;
  slug?: string | null;
}

export interface CouriorServiceRequest extends CouriorService {
  approved?: boolean | null;
  status?: string | null;
  requestStatus?: string | null;
  createdAt?: string | null;
  requestedAt?: string | null;
}

export interface CouriorServicesResponse {
  data: CouriorService[];
  total?: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface Merchant {
  id: string;
  name?: string | null;
  shopName?: string | null;
  businessName?: string | null;
  phone?: string | null;
  phone1?: string | null;
  ownerPhone?: string | null;
  email?: string | null;
  address?: string | null;
}

export interface MerchantListResponse {
  data: Merchant[];
  total?: number;
  page?: number;
  limit?: number;
}

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

export interface Rider {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  familyNumber?: string | null;
  nationalId?: string | null;
  vehicleNumber?: string | null;
  hubId?: string | null;
  courierServiceId?: string | null;
}

export interface RiderListResponse {
  data: Rider[];
  total?: number;
  page?: number;
  limit?: number;
}

export type { AdminUser as User, AdminUserListResponse as UserListResponse } from "@/features/admin/types/admin.types";

export interface Branding {
  colors: {
    accent: string;
    primary: string;
    secondary: string;
  };
  logoUrl?: string | null;
  logoFileName?: string | null;
  businessName?: string | null;
}