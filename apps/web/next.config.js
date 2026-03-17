/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@line-engage/shared"],
  output: "standalone",
};

module.exports = nextConfig;
