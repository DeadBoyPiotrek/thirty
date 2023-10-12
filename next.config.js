/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: [
      'lubcrvpkyrtngnmikcyd.supabase.co',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
    ],
  },
};

module.exports = nextConfig;
