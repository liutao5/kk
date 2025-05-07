/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  env: {
    HOST_API_KEY: "http://192.168.188.188:8080",
    // HOST_API_KEY: "http://106.15.139.63:8080",
  },
};

module.exports = nextConfig;
