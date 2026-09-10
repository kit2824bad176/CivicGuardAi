import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    
    // Protect admin routes
    if (path.startsWith("/admin") && token?.role !== "Admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    
    // Protect police routes
    if (path.startsWith("/police") && token?.role !== "Police Officer" && token?.role !== "Admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/police/:path*", "/complaints/:path*"]
};
