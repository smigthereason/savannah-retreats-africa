import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  readAdminSessionToken,
} from "@/lib/admin/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin/inquiries");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const sessionToken = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await readAdminSessionToken(sessionToken);

  if (!session) {
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
