"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Incorrect password");
      }
      const from = searchParams.get("from");
      // Only follow ?from= if it's a same-origin relative path — never
      // an absolute/external URL (open-redirect guard).
      const redirectTo =
        from && from.startsWith("/") && !from.startsWith("//") ? from : "/admin";
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="bg-linen w-full min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm bg-sand px-8 py-10 md:px-10 shadow-2xl">
        <span className="eyebrow">Admin</span>
        <h1 className="mt-3 font-display text-3xl text-umber">Sign In</h1>
        <p className="mt-3 text-[14px] text-ink/70">
          Enter the admin password to view and manage inquiries.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-[11px] uppercase tracking-widest2 text-ink/60">
              Password
            </span>
            <div className="relative mt-2">
              <input
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-umber/15 bg-linen px-4 py-3 pr-11 text-sm text-ink outline-none focus:border-ochre"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-ink/50 hover:text-ochre"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>
          {error && <p className="text-[13px] text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="btn-ochre w-full disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <section className="bg-linen w-full min-h-screen flex items-center justify-center">
          <p className="text-ink/60 text-sm">Loading…</p>
        </section>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
