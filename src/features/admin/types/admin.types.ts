export interface AdminUser {
  id: string;
  name?: string | null;
  phone?: string | null;
  role?: string | null;
  courierServiceId?: string | null;
  createdAt?: string | null;
}

export interface AdminUserListResponse {
  data: AdminUser[];
  total?: number;
  page?: number;
  limit?: number;
}
