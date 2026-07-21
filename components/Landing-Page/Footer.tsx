import Link from "next/link";
import { footer, navLinks } from "@/lib/data";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-umber pt-20 pb-10">
      <div className="section-pad mx-auto max-w-8xl">
        {/* Main grid: 1 col → 2 col on sm → 3 col on lg */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand — full width on mobile, spans 2 cols on sm tablet */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Image
              src="/logo.png"
              alt="Savannah Retreats"
              width={100}
              height={100}
              className="brightness-0 invert"
            />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-linen/70">
              {footer.about}
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-display text-2xl text-linen">Explore</h3>
            <ul className="mt-5 space-y-3 text-sm text-linen/70">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-ochre transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-2xl text-linen">Contact</h3>
            <div className="mt-5 space-y-1 text-sm text-linen/70">
              {footer.address.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <p className="mt-4 text-sm text-linen/70">{footer.phone}</p>
            <a
              href={`mailto:${footer.email}`}
              className="mt-1 block text-sm text-ochre hover:text-linen transition-colors"
            >
              {footer.email}
            </a>

            {/* Social */}
            <div className="mt-6 flex flex-wrap gap-4">
              {["Instagram", "X", "YouTube", "Facebook"].map((s) => (
                <span
                  key={s}
                  className="cursor-pointer text-xs uppercase tracking-widest2 text-linen/50 hover:text-ochre transition-colors"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 border-t border-linen/10 pt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-linen/40">
          <span>
            © {new Date().getFullYear()} Savannah Retreats Africa. All rights
            reserved.
          </span>
          <div className="flex gap-5">
            <Link
              href="/credits"
              className="hover:text-linen/70 transition-colors"
            >
              Image Credits
            </Link>
            <Link
              href="/privacy"
              className="hover:text-linen/70 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-linen/70 transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
