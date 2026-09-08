import { NextRequest, NextResponse } from "next/server";
import {
  getGoogleRedirectUri,
  isAuthorizedGoogleAdmin,
  verifyGoogleIdToken,
} from "@/lib/admin/googleAuth";
import {
  ADMIN_SESSION_COOKIE,
  GOOGLE_OAUTH_FROM_COOKIE,
  GOOGLE_OAUTH_STATE_COOKIE,
  adminSessionMaxAge,
  createAdminSessionToken,
} from "@/lib/admin/session";

function clearOAuthCookies(response: NextResponse) {
  response.cookies.set(GOOGLE_OAUTH_STATE_COOKIE, "", { path: "/", maxAge: 0 });
  response.cookies.set(GOOGLE_OAUTH_FROM_COOKIE, "", { path: "/", maxAge: 0 });
}

function fail(req: NextRequest, code: string) {
  const response = NextResponse.redirect(new URL(`/admin/login?error=${code}`, req.url));
  clearOAuthCookies(response);
  return response;
}

export async function GET(req: NextRequest) {
  const error = req.nextUrl.searchParams.get("error");
  if (error) return fail(req, "google");

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const expectedState = req.cookies.get(GOOGLE_OAUTH_STATE_COOKIE)?.value;

  if (!code || !state || !expectedState || state !== expectedState) {
    return fail(req, "state");
  }

  try {
    const origin = req.nextUrl.origin;
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: getGoogleRedirectUri(origin),
        grant_type: "authorization_code",
      }),
      cache: "no-store",
    });

    if (!tokenResponse.ok) {
      console.error("[admin-auth] Google token exchange failed", await tokenResponse.text());
      return fail(req, "google");
    }

    const tokenPayload = (await tokenResponse.json()) as { id_token?: string };
    if (!tokenPayload.id_token) return fail(req, "google");

    const identity = await verifyGoogleIdToken(tokenPayload.id_token);

    if (!isAuthorizedGoogleAdmin(identity.email, identity.hostedDomain)) {
      console.warn("[admin-auth] Google user is not on the admin allowlist", {
        email: identity.email,
      });
      return fail(req, "unauthorized");
    }

    const session = await createAdminSessionToken({
      sub: identity.sub,
      email: identity.email,
      name: identity.name,
      picture: identity.picture,
    });

    const fromCookie = req.cookies.get(GOOGLE_OAUTH_FROM_COOKIE)?.value;
    const destination =
      fromCookie && fromCookie.startsWith("/") && !fromCookie.startsWith("//")
        ? fromCookie
        : "/admin";

    const response = NextResponse.redirect(new URL(destination, origin));
    response.cookies.set(ADMIN_SESSION_COOKIE, session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: adminSessionMaxAge(),
    });
    clearOAuthCookies(response);
    return response;
  } catch (error) {
    console.error("[admin-auth] Google sign-in failed", error);
    return fail(req, "google");
  }
}
