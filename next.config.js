/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['antd'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://123.56.158.64:9001/:path*',
      },
    ]
  },
}

module.exports = nextConfig
