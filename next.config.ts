import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
      "http://10.0.4.23:3000",
      "http://127.0.0.1:3000",
      "http://localhost:3000",
    ],
};

export default nextConfig;
