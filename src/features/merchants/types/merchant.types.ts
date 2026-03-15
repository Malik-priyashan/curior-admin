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
