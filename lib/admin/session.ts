export const ADMIN_SESSION_COOKIE = "sra_admin_session";
export const GOOGLE_OAUTH_STATE_COOKIE = "sra_google_oauth_state";
export const GOOGLE_OAUTH_FROM_COOKIE = "sra_google_oauth_from";

const SESSION_TTL_SECONDS = 60 * 60 * 12;

export type AdminUser = {
  sub: string;
  email: string;
  name: string;
  picture?: string;
};

type AdminSessionPayload = AdminUser & {
  iat: number;
  exp: number;
};

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function stringToBase64Url(value: string) {
  return bytesToBase64Url(new TextEncoder().encode(value));
}

function base64UrlToBytes(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function base64UrlToString(value: string) {
  return new TextDecoder().decode(base64UrlToBytes(value));
}

async function getSigningKey() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return null;

  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function createAdminSessionToken(user: AdminUser) {
  const key = await getSigningKey();
  if (!key) throw new Error("ADMIN_SESSION_SECRET is not configured.");

  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSessionPayload = {
    ...user,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  };

  const encodedPayload = stringToBase64Url(JSON.stringify(payload));
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(encodedPayload),
  );

  return `${encodedPayload}.${bytesToBase64Url(new Uint8Array(signature))}`;
}

export async function readAdminSessionToken(token?: string | null): Promise<AdminUser | null> {
  if (!token) return null;

  const [encodedPayload, encodedSignature, extra] = token.split(".");
  if (!encodedPayload || !encodedSignature || extra) return null;

  try {
    const key = await getSigningKey();
    if (!key) return null;

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlToBytes(encodedSignature),
      new TextEncoder().encode(encodedPayload),
    );

    if (!valid) return null;

    const payload = JSON.parse(base64UrlToString(encodedPayload)) as AdminSessionPayload;
    const now = Math.floor(Date.now() / 1000);

    if (
      !payload.sub ||
      !payload.email ||
      !payload.name ||
      typeof payload.exp !== "number" ||
      payload.exp <= now
    ) {
      return null;
    }

    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
  } catch {
    return null;
  }
}

export function adminSessionMaxAge() {
  return SESSION_TTL_SECONDS;
}
