"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
          scrolled ? "bg-linen shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="section-pad mx-auto flex max-w-8xl items-center justify-between py-5">
          <Link href="/" className="flex flex-col leading-none">
            <Image
              src="/logo.png"
              alt="Savannah Retreats"
              width={100}
              height={100}
              style={{
                width: "auto",
                height: "auto",
                // Force base to pure white first, then apply subtle warmth for that high-end bone tone
                filter: !scrolled
                  ? "brightness(0) invert(1) sepia(5%) saturate(400%) hue-rotate(340deg) brightness(96%)"
                  : "none",
              }}
              className="transition-all duration-300 ease-in-out"
            />
          </Link>

          <nav className="hidden items-center gap-9 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-medium uppercase tracking-widest2 transition-colors ${
                  scrolled
                    ? "text-umber hover:text-ochre"
                    : "text-linen hover:text-ochre"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/packages"
            className={`hidden border px-6 py-3 text-xs font-semibold uppercase tracking-widest2 transition-colors lg:inline-flex ${
              scrolled
                ? "border-umber text-umber hover:bg-umber hover:text-linen"
                : "border-linen text-linen hover:bg-linen hover:text-umber"
            }`}
          >
            Plan a Trip
          </Link>
        </div>
      </header>

      {/* Signature vertical call tab, pinned to the viewport edge */}
      <a
        href="tel:+18552700044"
        className="fixed left-0 top-1/2 z-30 hidden -translate-y-1/2 items-center gap-3 py-6 pl-2 pr-3 text-linen mix-blend-difference md:flex"
        aria-label="Call Savannah Retreats Africa"
      >
        <span
          className="text-[11px] font-medium uppercase tracking-widest2"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Reservation · +1 855 270 0044
        </span>
      </a>
    </>
  );
}
