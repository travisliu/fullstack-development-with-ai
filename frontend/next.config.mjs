/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Matches all API requests
        destination: process.env.BACKEND_URL + '/api/:path*' // Proxy to backend, using an environment variable
      },
    ]
  },
};

export default nextConfig;
