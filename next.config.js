const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development'
});

module.exports = withPWA({
  reactStrictMode: true,
  basePath: '/perSpace',
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  }
});
