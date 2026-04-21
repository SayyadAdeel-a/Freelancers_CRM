/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Font optimization
  optimizeFonts: true,
  fontLoaders: {
    googleFonts: {
      display: 'swap',
    },
  },

  // Asset optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },
}

module.exports = nextConfig