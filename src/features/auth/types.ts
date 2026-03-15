import { z } from "zod";
import { LoginSchema } from "./schemas";

export type LoginCredentials = z.infer<typeof LoginSchema>;

declare module "next-auth" {
  interface Session {
    accessToken: string;
    error?: "RefreshTokenExpired";
    user: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      phone: string;
    };
  }

  interface User {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    phone: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    phone: string;
    error?: "RefreshTokenExpired";
  }
}
