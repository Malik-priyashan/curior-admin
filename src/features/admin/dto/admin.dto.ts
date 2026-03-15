export type RegisterAdminPayload = {
  name: string;
  phone: string;
  password: string;
  role: "ADMIN";
  courierServiceId: string;
};

export type RegisterAdminResponse = {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  user: unknown;
};
