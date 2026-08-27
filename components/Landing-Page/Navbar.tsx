"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { navLinks, footer } from "@/lib/data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(80);

  // Track scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Measure real header height
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

  const closeMenu = () => {
    setMenuOpen(false);
    setMobileSubmenu(null);
  };

  const navBg =
    scrolled || menuOpen
      ? "bg-linen shadow-sm"
      : "bg-gradient-to-b from-black/40 to-transparent";

  const desktopTextColour = scrolled
    ? "text-umber hover:text-ochre"
    : "text-linen hover:text-ochre";

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
      >
        <div className="section-pad mx-auto flex max-w-8xl items-center justify-between py-5">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Savannah Retreats home"
            className="flex flex-col leading-none"
          >
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
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 xl:flex">
            {navLinks.map((link) => {
              const hasChildren =
                "children" in link &&
                Array.isArray(link.children) &&
                link.children.length > 0;

              if (hasChildren) {
                return (
                  <div
                    key={link.label}
                    className="group relative"
                  >
                    <button
                      type="button"
                      className={`flex items-center gap-2 text-xs font-medium uppercase tracking-widest2 transition-colors ${desktopTextColour}`}
                    >
                      {link.label}

                      <span className="text-[10px] transition-transform duration-200 group-hover:rotate-180">
                        ▾
                      </span>
                    </button>

                    {/* Dropdown */}
                    <div
                      className="
                        invisible absolute left-1/2 top-full
                        z-50 min-w-[220px]
                        -translate-x-1/2 translate-y-3
                        pt-5 opacity-0
                        transition-all duration-200
                        group-hover:visible
                        group-hover:translate-y-0
                        group-hover:opacity-100
                      "
                    >
                      <div className="overflow-hidden border border-umber/10 bg-linen shadow-xl">
                        {link.children && link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="
                              block border-b border-umber/10
                              px-6 py-4
                              text-xs font-medium uppercase
                              tracking-widest2 text-umber
                              transition-colors
                              last:border-b-0
                              hover:bg-umber/5
                              hover:text-ochre
                            "
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              if (!("href" in link) || !link.href) {
                return null;
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-medium uppercase tracking-widest2 transition-colors ${desktopTextColour}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <Link
            href="/plantrip"
            className="hidden btn-ochre xl:inline-flex"
          >
            Plan a Trip
          </Link>

          {/* Hamburger */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="
              relative z-50 flex h-10 w-10
              flex-col items-center justify-center
              gap-[5px] rounded
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-ochre
              xl:hidden
            "
          >
            <span
              className={`block h-[2px] w-6 origin-center transition-all duration-300 ${
                scrolled || menuOpen ? "bg-umber" : "bg-linen"
              } ${
                menuOpen
                  ? "translate-y-[7px] rotate-45"
                  : ""
              }`}
            />

            <span
              className={`block h-[2px] w-6 transition-all duration-300 ${
                scrolled || menuOpen ? "bg-umber" : "bg-linen"
              } ${
                menuOpen
                  ? "opacity-0"
                  : ""
              }`}
            />

            <span
              className={`block h-[2px] w-6 origin-center transition-all duration-300 ${
                scrolled || menuOpen ? "bg-umber" : "bg-linen"
              } ${
                menuOpen
                  ? "-translate-y-[7px] -rotate-45"
                  : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile / Tablet Backdrop */}
      <div
        onClick={closeMenu}
        className={`fixed inset-0 z-40 bg-umber/50 backdrop-blur-sm transition-opacity duration-300 xl:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* Mobile / Tablet Drawer */}
      <div
        className={`fixed right-0 z-40 flex w-[min(380px,90vw)] flex-col bg-linen shadow-2xl transition-transform duration-300 ease-in-out xl:hidden ${
          menuOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
        style={{
          top: headerHeight,
          height: `calc(100dvh - ${headerHeight}px)`,
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <nav className="flex flex-1 flex-col overflow-y-auto px-8 pb-6 pt-8">
          {navLinks.map((link) => {
            const hasChildren =
              "children" in link &&
              Array.isArray(link.children) &&
              link.children.length > 0;

            if (hasChildren) {
              const isOpen =
                mobileSubmenu === link.label;

              return (
                <div
                  key={link.label}
                  className="border-b border-umber/10"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setMobileSubmenu(
                        isOpen ? null : link.label
                      )
                    }
                    className="
                      flex w-full items-center
                      justify-between py-4
                      text-left text-sm font-medium
                      uppercase tracking-widest2
                      text-umber transition-colors
                      hover:text-ochre
                    "
                  >
                    <span>{link.label}</span>

                    <span
                      className={`text-xs transition-transform duration-200 ${
                        isOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    >
                      ▾
                    </span>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen
                        ? "max-h-60 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pb-3 pl-4">
                      {link.children && link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={closeMenu}
                          className="
                            block py-3
                            text-xs font-medium uppercase
                            tracking-widest2 text-umber/70
                            transition-colors
                            hover:text-ochre
                          "
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            if (!("href" in link) || !link.href) {
              return null;
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="
                  border-b border-umber/10
                  py-4 text-sm font-medium
                  uppercase tracking-widest2
                  text-umber transition-colors
                  hover:text-ochre
                "
              >
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/plantrip"
            onClick={closeMenu}
            className="btn-ochre mt-8 justify-center text-center"
          >
            Plan a Trip
          </Link>
        </nav>

        {/* Engage With Us */}
        <div className="shrink-0 border-t border-umber/10 bg-linen px-8 py-6">
          <Link
            href="/engage"
            onClick={closeMenu}
            className="
              mb-3 block text-[11px]
              font-semibold uppercase
              tracking-widest2 text-ochre
              hover:underline
            "
          >
            Engage With Us
          </Link>

          <div className="flex flex-col gap-2 text-xs text-umber/80">
            <a
              href={`tel:${footer.phone.replace(
                /[^+\d]/g,
                ""
              )}`}
              className="transition-colors hover:text-ochre"
            >
              {footer.phone}
            </a>

            <a
              href={`mailto:${footer.email}`}
              className="transition-colors hover:text-ochre"
            >
              {footer.email}
            </a>

            <p className="text-umber/60">
              {footer.address.join(", ")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
