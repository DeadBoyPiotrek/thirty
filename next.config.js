/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: [
    //   'lubcrvpkyrtngnmikcyd.supabase.co',
    //   'lh3.googleusercontent.com',
    //   'avatars.githubusercontent.com',
    // ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lubcrvpkyrtngnmikcyd.supabase.co',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
      },
    ],
  },
};

module.exports = nextConfig;
