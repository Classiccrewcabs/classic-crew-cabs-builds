import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "150mb",
    },
    proxyClientMaxBodySize: "150mb",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "duhsjaxzmdrpbfuwnfwt.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
