/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Forwarded-Host",
            value: "hyzync-v5.netlify.app", // Ensure it matches your Netlify domain
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
