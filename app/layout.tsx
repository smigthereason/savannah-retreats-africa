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

export const metadata: Metadata = {
  title: "Savannah Retreats Africa | Luxury Kenyan Safaris",
  description:
    "Bespoke safari journeys and tented luxury camps across Kenya, crafted for travelers who want the wild without giving up refinement.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${raleway.variable} font-sans`}>
        <div className="min-h-screen overflow-hidden">{children}</div>
      </body>
    </html>
  );
}
