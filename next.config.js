/** @type {import('next').NextConfig} */
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV !== 'production',
  register: false,
});

const nextConfig = {
  assetPrefix: undefined,
  i18n: {
    locales: ['fa', 'en'],
    defaultLocale: 'fa',
    localeDetection: false,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // For client-side scripts
      config.optimization.minimizer = [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_console: true, // Remove console.log statements
            },
          },
        }),
      ];
    }

    return config;
  },
  compress: true,
  reactStrictMode: true,
  swcMinify: true,
  images: {
    // formats: ['image/avif', 'image/webp'],
    domains: [
      process.env.NEXT_PUBLIC_STRAPI_MEDIA_BASE_URL.replace('https://', ''),
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_STRAPI_MEDIA_BASE_URL.replace(
          'https://',
          '',
        ),
      },
      // to dev only
      {
        protocol: 'https',
        hostname: 'arzinja.info',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=84600, must-revalidate',
          },
        ],
      },
    ];
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(withPWA(nextConfig));
