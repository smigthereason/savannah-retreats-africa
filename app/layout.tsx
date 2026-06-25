// import type { Metadata } from "next";
// import { Fraunces, Inter } from "next/font/google";
// import "./globals.css";

// const fraunces = Fraunces({
//   subsets: ["latin"],
//   variable: "--font-fraunces",
//   weight: ["400", "500", "600"],
//   style: ["normal", "italic"],
// });

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter",
//   weight: ["400", "500", "600", "700"],
// });

// export const metadata: Metadata = {
//   title: "Savannah Retreats Africa | Luxury Kenyan Safaris",
//   description:
//     "Bespoke safari journeys and tented luxury camps across Kenya, crafted for travelers who want the wild without giving up refinement.",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{ children: React.ReactNode }>) {
//   return (
//     <html lang="en">
//       <body className={`${fraunces.variable} ${inter.variable} font-sans`}>
//         {children}
//       </body>
//     </html>
//   );
// }
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
        {children}
      </body>
    </html>
  );
}
