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
        hostname: "www.masaimara.travel",
      },
      {
        protocol: "https",
        hostname: "www.newmarketholidays.co.uk",
      },
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
        hostname: "www.south-african-lodges.com",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      {
        protocol: "https",
        hostname: "images.scottdunn.com",
      },
      {
        protocol: "https",
        hostname: "cdn.tuko.co.ke",
      },
    ],
  },
};

export default nextConfig;
