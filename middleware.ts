import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE = "sra_admin_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin/inquiries");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const session = req.cookies.get(ADMIN_COOKIE)?.value;

  if (!session || session !== process.env.ADMIN_SESSION_SECRET) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
