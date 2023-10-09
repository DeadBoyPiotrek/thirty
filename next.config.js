/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['lubcrvpkyrtngnmikcyd.supabase.co'],
  },
};

module.exports = nextConfig;
