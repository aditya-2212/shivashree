import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Expose the current path to Server Components via a request header. The
  // public layout reads this so the navbar can render in the correct mode on
  // the SERVER (transparent over the homepage hero, solid elsewhere) — without
  // it, usePathname() is null during static prerender and the nav ships white.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);
  const forward = () => NextResponse.next({ request: { headers: requestHeaders } });

  if (pathname === "/admin/login") {
    return forward();
  }

  if (pathname.startsWith("/admin")) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
      cookieName: "next-auth.session-token",
    });

    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return forward();
}

export const config = {
  // Run on every page (to set x-pathname) except static assets and image files.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.[^/]+$).*)"],
};
