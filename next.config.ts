import type { NextConfig } from "next";

// Static export: the whole UI is client-side, so it builds to plain files (out/) that
// Vercel (or any static host) serves. The API lives on the home server, at
// NEXT_PUBLIC_API_URL; nothing is proxied through the frontend host, video included.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
