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
        source: "/(.*)",
        headers: [
          {
            key: "X-Forwarded-Host",
            value: "hyzync-v5.netlify.app", // Ensure this matches your Netlify domain
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
