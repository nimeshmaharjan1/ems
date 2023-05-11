/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['naajvhwyqrtaxybvcdzm.supabase.co', 'images.unsplash.com', 'avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  experimental: {
    appDir: false,
  },
};

module.exports = nextConfig;
