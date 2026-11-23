import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Photos upload straight from the browser to Supabase Storage, so
    // form submissions only carry text + storage paths. Keep this small so
    // a large request can't exhaust memory on the Render instance.
    serverActions: {
      bodySizeLimit: "2mb",
    },
    proxyClientMaxBodySize: "2mb",
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
