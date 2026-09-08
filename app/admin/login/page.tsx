"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ExternalLink,
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

const ERROR_COPY: Record<string, string> = {
  config:
    "Google admin authentication is not configured on the server yet.",
  unauthorized:
    "This Google account is not authorized to access the Savannah Retreats admin portal.",
  state:
    "The sign-in session could not be verified. Please try again.",
  google:
    "Google sign-in could not be completed. Please try again.",
};

function LoginForm() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const errorCode = searchParams.get("error");
  const error = errorCode ? ERROR_COPY[errorCode] || ERROR_COPY.google : null;

  const safeFrom =
    from && from.startsWith("/") && !from.startsWith("//") ? from : "/admin";
  const googleHref = `/api/admin/auth/google/start?from=${encodeURIComponent(safeFrom)}`;

  return (
    <main className="min-h-screen bg-linen">
      <div className="grid min-h-screen lg:grid-cols-[0.92fr_1.08fr]">
        <section className="relative hidden overflow-hidden bg-umber px-12 py-12 text-linen lg:flex lg:flex-col lg:justify-between xl:px-16 xl:py-14">
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
              Sign in with an approved Google account. Every reply sent from
              the portal remains from the company mailbox and is attributed to
              the staff member who sent it.
            </p>

            {error ? (
              <div className="mt-6 border-l-2 border-red-600 bg-red-50 px-4 py-3 text-[12px] leading-5 text-red-700">
                {error}
              </div>
            ) : null}

            <a
              href={googleHref}
              className="mt-8 flex w-full items-center justify-center gap-3 border border-umber/15 bg-white px-4 py-4 text-[12px] font-medium text-umber transition hover:border-ochre hover:bg-sand/30"
            >
              <GoogleMark />
              <span>Continue with Google</span>
              <ArrowRight size={15} className="ml-auto text-ochre" />
            </a>

            <div className="mt-8 border-t border-umber/10 pt-5">
              <p className="text-[10px] leading-5 text-ink/40">
                Access is restricted to email addresses or a Google Workspace
                domain configured by the site administrator. The shared admin
                password flow is disabled so replies can always be traced to an
                individual staff account.
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
          <p className="text-[12px] text-ink/50">Loading secure workspace…</p>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
