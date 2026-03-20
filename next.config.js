const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.ENABLE_PWA !== 'true'
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
