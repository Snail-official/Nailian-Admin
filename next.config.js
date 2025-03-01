const s3Domain = process.env.AWS_S3_URL
  ? process.env.AWS_S3_URL.replace(/^https?:\/\//, '')
  : '';

const cdnDomain = process.env.AWS_CLOUDFRONT_DOMAIN
  ? process.env.AWS_CLOUDFRONT_DOMAIN.replace(/^https?:\/\//, '')
  : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  images: {
    domains: [s3Domain, cdnDomain].filter(Boolean),
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? `${process.env.AWS_CLOUDFRONT_DOMAIN}` : '',
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

module.exports = nextConfig;
