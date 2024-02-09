/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_ZEGO_APP_ID:2024640361,
    NEXT_PUBLIC_ZEGO_SERVER_ID: "0a93a59ac872243a9db44d2398f6a599"
  },
  images: {
    domains: ["localhost","192.168.111.124"],
  },
};

module.exports = nextConfig;
