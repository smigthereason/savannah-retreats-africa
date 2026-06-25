import Link from "next/link";
import { footer, navLinks } from "@/lib/data";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-umber pt-20 pb-10">
      <div className="section-pad mx-auto grid max-w-8xl grid-cols-1 gap-12 md:grid-cols-3">
        <div>
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

        <div>
          <h3 className="font-display text-2xl text-linen">Explore</h3>
          <ul className="mt-5 space-y-3 text-sm text-linen/70">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-ochre">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

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
            className="mt-1 block text-sm text-ochre hover:text-linen"
          >
            {footer.email}
          </a>

          <div className="mt-6 flex gap-4">
            {["Instagram", "X", "YouTube", "Facebook"].map((s) => (
              <span
                key={s}
                className="text-xs uppercase tracking-widest2 text-linen/50 hover:text-ochre"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="section-pad mx-auto mt-16 max-w-8xl border-t border-linen/10 pt-6 text-xs text-linen/40">
        © {new Date().getFullYear()} Savannah Retreats Africa. All rights
        reserved.
      </div>
    </footer>
  );
}
