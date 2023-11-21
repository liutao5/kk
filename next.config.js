/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  env: {
    HOST_API: "http://106.15.139.63:8080",
  },
};

module.exports = nextConfig;
