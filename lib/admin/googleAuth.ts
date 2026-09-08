type GoogleIdTokenHeader = {
  alg?: string;
  kid?: string;
};

type GoogleIdTokenPayload = {
  iss?: string;
  aud?: string | string[];
  sub?: string;
  email?: string;
  email_verified?: boolean | string;
  name?: string;
  picture?: string;
  hd?: string;
  exp?: number;
};

type GoogleJwk = JsonWebKey & { kid?: string; alg?: string; use?: string };

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function decodeJsonPart<T>(value: string): T {
  return JSON.parse(new TextDecoder().decode(decodeBase64Url(value))) as T;
}

export function getGoogleRedirectUri(origin: string) {
  return (
    process.env.GOOGLE_OAUTH_REDIRECT_URI ||
    `${origin}/api/admin/auth/google/callback`
  );
}

export function googleAuthIsConfigured() {
  const hasAllowlist = Boolean(
    (process.env.ADMIN_ALLOWED_EMAILS || "").trim() ||
      (process.env.ADMIN_ALLOWED_GOOGLE_DOMAIN || "").trim(),
  );

  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.ADMIN_SESSION_SECRET &&
      hasAllowlist,
  );
}

export function isAuthorizedGoogleAdmin(email: string, hostedDomain?: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const allowedEmails = (process.env.ADMIN_ALLOWED_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (allowedEmails.includes(normalizedEmail)) return true;

  const allowedDomain = (process.env.ADMIN_ALLOWED_GOOGLE_DOMAIN || "")
    .trim()
    .toLowerCase();

  return Boolean(
    allowedDomain &&
      hostedDomain?.toLowerCase() === allowedDomain &&
      normalizedEmail.endsWith(`@${allowedDomain}`),
  );
}

export async function verifyGoogleIdToken(idToken: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error("GOOGLE_CLIENT_ID is not configured.");

  const parts = idToken.split(".");
  if (parts.length !== 3) throw new Error("Invalid Google ID token.");

  const [headerPart, payloadPart, signaturePart] = parts;
  const header = decodeJsonPart<GoogleIdTokenHeader>(headerPart);
  const payload = decodeJsonPart<GoogleIdTokenPayload>(payloadPart);

  if (header.alg !== "RS256" || !header.kid) {
    throw new Error("Unexpected Google ID token signing algorithm.");
  }

  const certResponse = await fetch("https://www.googleapis.com/oauth2/v3/certs", {
    cache: "no-store",
  });

  if (!certResponse.ok) {
    throw new Error("Unable to retrieve Google signing keys.");
  }

  const { keys } = (await certResponse.json()) as { keys?: GoogleJwk[] };
  const jwk = keys?.find((key) => key.kid === header.kid);
  if (!jwk) throw new Error("Google signing key was not found.");

  const publicKey = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );

  const signedContent = new TextEncoder().encode(`${headerPart}.${payloadPart}`);
  const signature = decodeBase64Url(signaturePart);
  const signatureValid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    publicKey,
    signature,
    signedContent,
  );

  if (!signatureValid) throw new Error("Google ID token signature is invalid.");

  const issuerValid =
    payload.iss === "accounts.google.com" ||
    payload.iss === "https://accounts.google.com";
  const audienceValid = Array.isArray(payload.aud)
    ? payload.aud.includes(clientId)
    : payload.aud === clientId;
  const notExpired = typeof payload.exp === "number" && payload.exp > Date.now() / 1000;
  const emailVerified = payload.email_verified === true || payload.email_verified === "true";

  if (!issuerValid || !audienceValid || !notExpired || !emailVerified) {
    throw new Error("Google ID token claims are invalid.");
  }

  if (!payload.sub || !payload.email) {
    throw new Error("Google account identity is incomplete.");
  }

  return {
    sub: payload.sub,
    email: payload.email,
    name: payload.name || payload.email,
    picture: payload.picture,
    hostedDomain: payload.hd,
  };
}
