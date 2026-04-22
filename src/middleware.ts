import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    // If already on login page, don't redirect
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    // All other /admin routes require authentication
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const { pathname } = req.nextUrl;

        // Login page is always accessible
        if (pathname === "/admin/login") return true;

        // All other admin routes require a valid token
        if (pathname.startsWith("/admin")) {
          return !!token;
        }

        return true;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
