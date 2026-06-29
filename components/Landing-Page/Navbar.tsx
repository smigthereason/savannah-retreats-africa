"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { navLinks } from "@/lib/data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(80);

  // Track scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Measure real header height so drawer spacer is always exact
  useEffect(() => {
    const measure = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Always show a background when over a hero — add a subtle gradient so
  // the hamburger is visible even when bg-transparent
  const navBg =
    scrolled || menuOpen
      ? "bg-linen shadow-sm"
      : "bg-gradient-to-b from-black/40 to-transparent";

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
      >
        <div className="section-pad mx-auto flex max-w-8xl items-center justify-between py-5">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none">
            <Image
              src="/logo.png"
              alt="Savannah Retreats"
              width={100}
              height={100}
              style={{
                width: "auto",
                height: "auto",
                filter:
                  !scrolled && !menuOpen
                    ? "brightness(0) invert(1) sepia(5%) saturate(400%) hue-rotate(340deg) brightness(96%)"
                    : "none",
              }}
              className="transition-all duration-300 ease-in-out"
            />
          </Link>

          {/* Desktop nav — hidden below xl */}
          <nav className="hidden items-center gap-9 xl:flex">
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

          {/* Desktop CTA — hidden below xl */}
          <Link href="/plantrip" className="hidden btn-ochre xl:inline-flex">
            Plan a Trip
          </Link>

          {/* Hamburger — visible below xl */}
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="relative z-50 flex xl:hidden flex-col justify-center items-center gap-[5px] w-10 h-10 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-ochre"
          >
            <span
              className={`block h-[2px] w-6 transition-all duration-300 origin-center ${
                scrolled || menuOpen ? "bg-umber" : "bg-linen"
              } ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span
              className={`block h-[2px] w-6 transition-all duration-300 ${
                scrolled || menuOpen ? "bg-umber" : "bg-linen"
              } ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-[2px] w-6 transition-all duration-300 origin-center ${
                scrolled || menuOpen ? "bg-umber" : "bg-linen"
              } ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </header>

      {/* ── Mobile / tablet drawer ── */}

      {/* Backdrop overlay */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-umber/50 backdrop-blur-sm transition-opacity duration-300 xl:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Drawer panel — sits below the header, not behind it */}
      <div
        className={`fixed right-0 z-40 w-[min(360px,90vw)] bg-linen shadow-2xl flex flex-col transition-transform duration-300 ease-in-out xl:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          top: headerHeight, // flush with bottom of real header
          height: `calc(100dvh - ${headerHeight}px)`, // fill remaining viewport
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <nav className="flex flex-col gap-1 px-8 pt-8 pb-8 flex-1 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium uppercase tracking-widest2 text-umber hover:text-ochre py-4 border-b border-umber/10 transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/plantrip"
            onClick={() => setMenuOpen(false)}
            className="btn-ochre mt-8 justify-center text-center"
          >
            Plan a Trip
          </Link>
        </nav>

        <p className="px-8 py-6 text-xs text-umber/40 uppercase tracking-widest2 shrink-0">
          Savannah Retreats Africa
        </p>
      </div>
    </>
  );
}
