/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  basePath: '/quotation-web',
  transpilePackages: ['antd'],
  images: {
    loader: 'akamai',
    path: '',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://123.56.158.64:9001/:path*',
        basePath: false,
      },
    ]
  },
}

module.exports = nextConfig
