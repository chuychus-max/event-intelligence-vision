import type { NextConfig } from "next";

// Static export: `next build` writes plain HTML/JS to out/, which Vercel (or any
// static host) serves as-is. Nothing here needs a server.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
