import type { Metadata } from "next";
import { Cormorant_Garamond, Raleway } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["300", "400", "500", "600", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://savannahretreatsafrica.com";
const SITE_TITLE = "Savannah Retreats Africa | Luxury Kenyan Safaris";
const SITE_DESCRIPTION =
  "Bespoke safari journeys and tented luxury camps across Kenya, crafted for travelers who want the wild without giving up refinement.";

export const metadata: Metadata = {
  // Resolves relative URLs (like the OG image below) to absolute ones,
  // and is required for Next's automatic canonical-URL generation to
  // work at all — without this, canonical tags silently don't render.
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Savannah Retreats Africa",
    images: [{ url: "/logo-no-bg.png", width: 512, height: 512 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/logo-no-bg.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Full street address still being finalized — deliberately just
  // state/country (Texas, matching the business phone's Fort
  // Worth/DFW area code) rather than a fabricated street/ZIP. Update
  // once confirmed, and keep in sync with lib/data.ts's `footer`
  // object and lib/mail.ts's email footer.
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Savannah Retreats Africa",
    url: SITE_URL,
    logo: `${SITE_URL}/logo-no-bg.png`,
    description: SITE_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      addressRegion: "TX",
      addressCountry: "US",
    },
    telephone: "+1-682-346-4863",
    priceRange: "$$$",
  };

  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${raleway.variable} font-sans`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <div className="min-h-screen overflow-hidden">{children}</div>
      </body>
    </html>
  );
}
