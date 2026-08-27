import Link from "next/link";
import { footer, navLinks } from "@/lib/data";
import Image from "next/image";

export default function Footer() {
  /*
   * Navbar items can now contain dropdown children.
   * The footer does not need dropdowns, so flatten them
   * into normal links.
   */
  const footerNavLinks = navLinks.flatMap((link) => {
    if (
      "children" in link &&
      Array.isArray(link.children) &&
      link.children.length > 0
    ) {
      return link.children;
    }

    if ("href" in link && link.href) {
      return [
        {
          label: link.label,
          href: link.href,
        },
      ];
    }

    return [];
  });

  return (
    <footer className="bg-umber pt-20 pb-10">
      <div className="section-pad mx-auto max-w-8xl">
        {/* Main grid */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" aria-label="Savannah Retreats home">
              <Image
                src="/logo.png"
                alt="Savannah Retreats"
                width={100}
                height={100}
                className="brightness-0 invert"
              />
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-linen/70">
              {footer.about}
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-display text-2xl text-linen">
              Explore
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-linen/70">
              {/* Flattened primary navigation */}
              {footerNavLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-ochre"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              {/* Contact */}
              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-ochre"
                >
                  Contact
                </Link>
              </li>

              {/* FAQ */}
              <li>
                <Link
                  href="/faq"
                  className="transition-colors hover:text-ochre"
                >
                  FAQ
                </Link>
              </li>

              {/* Engage */}
              <li className="pt-2">
                <Link
                  href="/engage"
                  className="text-ochre transition-colors hover:text-linen"
                >
                  Engage With Us →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-2xl text-linen">
              Contact
            </h3>

            <div className="mt-5 space-y-1 text-sm text-linen/70">
              {footer.address.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            <p className="mt-4 text-sm text-linen/70">
              {footer.phone}
            </p>

            <a
              href={`mailto:${footer.email}`}
              className="mt-1 block text-sm text-ochre transition-colors hover:text-linen"
            >
              {footer.email}
            </a>

            {/* Social */}
            <div className="mt-6 flex flex-wrap gap-4">
              {["Instagram", "X", "YouTube", "Facebook"].map(
                (social) => (
                  <span
                    key={social}
                    className="cursor-pointer text-xs uppercase tracking-widest2 text-linen/50 transition-colors hover:text-ochre"
                  >
                    {social}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col gap-3 border-t border-linen/10 pt-6 text-xs text-linen/40 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} Savannah Retreats Africa.
            All rights reserved.
          </span>

          <div className="flex flex-wrap gap-5">
            <Link
              href="/credits"
              className="transition-colors hover:text-linen/70"
            >
              Image Credits
            </Link>

            <Link
              href="/privacy"
              className="transition-colors hover:text-linen/70"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition-colors hover:text-linen/70"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
