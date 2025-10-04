/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Add cache headers for static assets when served
  async headers() {
    return [
      {
        source: '/info/sneakers-images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year cache for images
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
