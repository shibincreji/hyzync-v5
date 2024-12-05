/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Enable strict mode for React

  // Enable server actions if you're using them
  experimental: {
    serverActions: true, // Enable server actions for Next.js 13 app router
  },

  // Custom headers if you need them (like for security or forwarding headers)
  async headers() {
    return [
      {
        source: "/(.*)", // Applies to all routes
        headers: [
          {
            key: "X-Forwarded-Host",
            value: "hyzync-v5.netlify.app", // Replace with your domain if needed
          },
        ],
      },
    ];
  },

  // Adding custom environment variables (same as you added to `vercel.json`)
  env: {
    COSMIC_BUCKET_SLUG: process.env.COSMIC_BUCKET_SLUG,
    COSMIC_READ_KEY: process.env.COSMIC_READ_KEY,
    COSMIC_WRITE_KEY: process.env.COSMIC_WRITE_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_EMAIL: process.env.CONTACT_EMAIL,
  },

  // Optional: Custom build settings or redirects if needed
  async redirects() {
    return [
      {
        source: "/old-url",
        destination: "/new-url",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
