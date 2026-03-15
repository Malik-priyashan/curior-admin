import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/features/auth/schemas";
import type { JWT } from "next-auth/jwt";

function extractCookie(res: Response, name: string): string | null {
  const setCookies = res.headers.getSetCookie?.() ?? [];
  for (const cookie of setCookies) {
    const match = cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
    if (match) return match[1];
  }
  return null;
}

let refreshPromise: Promise<JWT> | null = null;

async function refreshAccessToken(token: JWT): Promise<JWT> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = performRefresh(token);
  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

async function performRefresh(token: JWT): Promise<JWT> {
  try {
    console.log("Refreshing access token...",token);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${token.refreshToken}`,
      },
    });

    if (!res.ok) {
      return { ...token, error: "RefreshTokenExpired" as const };
    }

    const data = await res.json();
    const rotatedRefreshToken = extractCookie(res, "refreshToken");

    return {
      ...token,
      accessToken: data.accessToken,
      accessTokenExpires: data.accessTokenExpiresAt ?? Date.now() + 2 * 60 * 1000,
      refreshToken: rotatedRefreshToken ?? token.refreshToken,
      error: undefined,
    };
  } catch {
    return { ...token, error: "RefreshTokenExpired" as const };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        phone: { label: "Phone Number", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { phone, password } = parsed.data;

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, password }),
          });

          if (!res.ok) return null;
          const data = await res.json();
          if (!data.accessToken) return null;

          const refreshToken = extractCookie(res, "refreshToken");

          return {
            id: data.user?.id ?? phone,
            name: data.user?.name ?? null,
            phone: data.user?.phone ?? phone,
            accessToken: data.accessToken,
            refreshToken: refreshToken ?? "",
            accessTokenExpires: data.accessTokenExpiresAt ?? Date.now() + 2 * 60 * 1000,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires,
          phone: user.phone,
          name: user.name,
        };
      }

      if (token.error) {
        return token;
      }

      if (Date.now() < (token.accessTokenExpires ?? 0) - 60 * 1000) {
        return token;
      }

      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.phone = token.phone;
      session.user.name = token.name;

      if (token.error) {
        session.error = token.error;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },
});
