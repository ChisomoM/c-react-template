/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore ESLint errors during production builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignore TypeScript errors during production builds (optional)
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
         protocol: 'https',
         hostname: 'firebasestorage.googleapis.com',
      }
    ],
  },
};

export default nextConfig;