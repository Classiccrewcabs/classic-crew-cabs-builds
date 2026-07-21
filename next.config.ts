import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "150mb",
    },
    proxyClientMaxBodySize: "150mb",
  },
  images: {
    // Photos are already resized/compressed at upload time, so skip
    // Next's server-side re-optimization on every visitor page load -
    // avoids extra memory use on the Render instance for public traffic.
    unoptimized: true,
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
