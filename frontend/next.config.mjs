/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Any request starting with /api...
        destination: 'http://localhost:8080/api/:path*', // ...send to Express Backend
      },
    ];
  },
};

export default nextConfig;