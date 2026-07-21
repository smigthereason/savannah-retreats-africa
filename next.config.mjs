/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["next-sanity"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "www.masaimara.travel",
      },
      // NOTE: www.newmarketholidays.co.uk removed — was hotlinking a
      // competitor's own marketing image directly from their CDN
      // (see lib/packages-data.ts). Swap for a licensed/Unsplash image
      // before re-adding any third-party operator domain here.
      {
        protocol: "https",
        hostname: "images.goway.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.scottdunn.com",
      },
      {
        protocol: "https",
        hostname: "cdn.tuko.co.ke",
      },
      {
        protocol: "https",
        hostname: "pixabay.com",
      },
    ],
  },

  // Baseline security headers (audit finding: no headers configured).
  // Deliberately does NOT include a strict Content-Security-Policy —
  // getting CSP right for Sanity Studio's bundle (which needs inline
  // scripts/eval) requires live testing against the deployed Studio
  // that isn't safe to guess at blind. Add CSP as a follow-up once you
  // can test it against a running deployment.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
