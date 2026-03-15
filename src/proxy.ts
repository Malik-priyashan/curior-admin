import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;

  const isLoggedIn = !!session;
  const isAuthPage = nextUrl.pathname.startsWith("/login");
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicAsset = /\.[^/]+$/.test(nextUrl.pathname);

  if (isPublicAsset) return NextResponse.next();

  if (isApiAuthRoute) return NextResponse.next();

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
