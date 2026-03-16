import type { NextConfig } from "next";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${apiBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
