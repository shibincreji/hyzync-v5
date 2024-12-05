/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      validateHeaders: false, // Disable strict header validation for Server Actions
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)", // Match all routes
        headers: [
          {
            key: "X-Forwarded-Host",
            value: "hyzync-v5.netlify.app", // Ensure this matches your Netlify domain
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Allow all origins (adjust based on your requirements)
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, OPTIONS", // Allow these HTTP methods
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization", // Allow necessary headers
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
