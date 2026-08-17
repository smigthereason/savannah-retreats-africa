"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  ExternalLink,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

function GoogleMark() {
  return (
    <span
      aria-hidden="true"
      className="flex h-7 w-7 items-center justify-center rounded-full border border-umber/10 bg-white font-sans text-[13px] font-bold text-umber"
    >
      G
    </span>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Incorrect password");
      }

      const from = searchParams.get("from");

      const redirectTo =
        from && from.startsWith("/") && !from.startsWith("//")
          ? from
          : "/admin";

      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-linen">
      <div className="grid min-h-screen lg:grid-cols-[0.92fr_1.08fr]">
        <section className="relative hidden overflow-hidden bg-acacia px-12 py-12 text-linen lg:flex lg:flex-col lg:justify-between xl:px-16 xl:py-14">
          <Link href="/" className="flex w-fit items-center gap-3">
            <Image
              src="/admin-logo.png"
              alt="Savannah Retreats Africa"
              width={50}
              height={50}
              className="h-12 w-12 object-contain"
            />
            <div>
              <p className="font-display text-2xl leading-none">
                Savannah Retreats
              </p>
              <p className="mt-1 text-[9px] uppercase tracking-widest2 text-linen/55">
                Africa
              </p>
            </div>
          </Link>

          <div className="max-w-lg">
            <span className="text-[10px] uppercase tracking-widest2 text-linen/55">
              Internal workspace
            </span>
            <h1 className="mt-6 font-display text-6xl leading-[0.98] xl:text-7xl">
              Thoughtful journeys deserve thoughtful operations.
            </h1>
            <p className="mt-7 max-w-md text-[14px] leading-7 text-linen/70">
              Manage traveller enquiries, journey requests and follow-up from
              one private Savannah Retreats workspace.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-linen/50">
            <ShieldCheck size={15} strokeWidth={1.5} />
            Authorized personnel only
          </div>

          <div className="pointer-events-none absolute -bottom-48 -right-36 h-[520px] w-[520px] rounded-full border border-linen/10" />
          <div className="pointer-events-none absolute -bottom-20 -right-8 h-[300px] w-[300px] rounded-full border border-linen/10" />
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-[460px]">
            <div className="flex items-center justify-between lg:hidden">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/admin-logo.png"
                  alt="Savannah Retreats Africa"
                  width={42}
                  height={42}
                  className="h-10 w-10 object-contain"
                />
                <span className="font-display text-xl text-umber">
                  Savannah Retreats
                </span>
              </Link>

              <Link
                href="/"
                className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest2 text-ink/45"
              >
                Site
                <ExternalLink size={11} />
              </Link>
            </div>

            <span className="mt-12 block text-[10px] font-semibold uppercase tracking-widest2 text-ochre lg:mt-0">
              Administration
            </span>

            <h2 className="mt-4 font-display text-4xl text-umber sm:text-5xl">
              Welcome back.
            </h2>

            <p className="mt-4 max-w-sm text-[13px] leading-6 text-ink/60">
              Sign in to review enquiries, respond to travellers and manage the
              lead pipeline.
            </p>

            <div className="mt-8">
              <button
                type="button"
                disabled
                title="Google sign-in will be enabled when individual admin accounts are introduced."
                className="flex w-full cursor-not-allowed items-center justify-center gap-3 border border-umber/15 bg-white px-4 py-3.5 text-[12px] font-medium text-umber opacity-60"
              >
                <GoogleMark />
                <span>Continue with Google</span>
                <span className="ml-auto border border-umber/10 bg-sand px-2 py-1 text-[8px] uppercase tracking-widest2 text-ink/45">
                  Planned
                </span>
              </button>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-umber/10" />
                <span className="text-[9px] uppercase tracking-widest2 text-ink/35">
                  Current access
                </span>
                <div className="h-px flex-1 bg-umber/10" />
              </div>

              <form onSubmit={handleSubmit}>
                <label className="block">
                  <span className="text-[10px] font-semibold uppercase tracking-widest2 text-ink/45">
                    Admin password
                  </span>

                  <div className="relative mt-2">
                    <LockKeyhole
                      size={16}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/35"
                    />

                    <input
                      required
                      autoComplete="current-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      className="w-full border border-umber/15 bg-white py-3.5 pl-11 pr-12 text-[13px] text-umber outline-none placeholder:text-ink/30 focus:border-ochre"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute inset-y-0 right-0 flex items-center px-4 text-ink/40 hover:text-ochre"
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </label>

                {error ? (
                  <div className="mt-4 border-l-2 border-red-600 bg-red-50 px-4 py-3 text-[12px] leading-5 text-red-700">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-5 flex w-full items-center justify-center gap-3 bg-ochre px-6 py-4 text-[10px] font-semibold uppercase tracking-widest2 text-white transition hover:bg-umber disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Signing in…" : "Sign in"}
                  {!submitting ? <ArrowRight size={15} /> : null}
                </button>
              </form>
            </div>

            <div className="mt-8 border-t border-umber/10 pt-5">
              <p className="text-[10px] leading-5 text-ink/40">
                Google authentication is intentionally not active yet. The
                interface is ready for individual admin accounts when the
                authentication provider is introduced; the current password
                flow remains unchanged.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-linen">
          <p className="text-[12px] text-ink/50">
            Loading secure workspace…
          </p>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
