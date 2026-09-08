import { NextRequest, NextResponse } from "next/server";
import {
  getGoogleRedirectUri,
  googleAuthIsConfigured,
} from "@/lib/admin/googleAuth";
import {
  GOOGLE_OAUTH_FROM_COOKIE,
  GOOGLE_OAUTH_STATE_COOKIE,
} from "@/lib/admin/session";

function safeFrom(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//")
    ? value
    : "/admin";
}

export async function GET(req: NextRequest) {
  if (!googleAuthIsConfigured()) {
    return NextResponse.redirect(new URL("/admin/login?error=config", req.url));
  }

  const state = crypto.randomUUID();
  const origin = req.nextUrl.origin;
  const redirectUri = getGoogleRedirectUri(origin);
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  authUrl.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID!);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("prompt", "select_account");
  authUrl.searchParams.set("include_granted_scopes", "true");

  const response = NextResponse.redirect(authUrl);
  const secure = process.env.NODE_ENV === "production";

  response.cookies.set(GOOGLE_OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60,
  });
  response.cookies.set(GOOGLE_OAUTH_FROM_COOKIE, safeFrom(req.nextUrl.searchParams.get("from")), {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60,
  });

  return response;
}
