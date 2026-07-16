/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * Scope / limitations (read before relying on this for high-traffic use):
 * - State lives in a module-level Map, so it's per server instance/process.
 *   On a single long-running Node server this works correctly. On
 *   serverless/edge platforms with multiple concurrent instances (e.g.
 *   Vercel under real load) each instance has its own counters, so the
 *   *effective* limit is roughly (limit × instance count), not exact.
 *   That's still a large improvement over "no limiting at all" for a
 *   low-to-moderate-traffic inquiry site, but if traffic grows enough
 *   that precise, cross-instance limiting matters, swap this for
 *   Upstash Ratelimit (Redis-backed) — same call signature, drop-in.
 * - Resets on cold start / deploy. Again: fine for spam/brute-force
 *   deterrence, not a substitute for a real WAF if you're ever a
 *   high-value target.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Periodic cleanup so the Map doesn't grow unbounded on a long-running
// process. No-op cost on serverless (process just gets recycled).
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  resetAt: number;
};

/**
 * @param key       Unique key for the caller, e.g. `inquiries:${ip}`.
 * @param limit     Max requests allowed within the window.
 * @param windowMs  Window size in milliseconds.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  cleanup(now);

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { success: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return {
    success: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  };
}

/**
 * Best-effort client IP extraction behind a proxy (Vercel, etc).
 * Falls back to a constant so rate limiting still applies (very
 * conservatively, shared across all un-identifiable callers) rather
 * than silently no-op'ing if headers are ever missing.
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}
