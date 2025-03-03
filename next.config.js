const s3Domain = process.env.AWS_S3_URL
  ? process.env.AWS_S3_URL.replace(/^https?:\/\//, '')
  : '';

const cdnDomain = process.env.AWS_CLOUDFRONT_DOMAIN
  ? process.env.AWS_CLOUDFRONT_DOMAIN.replace(/^https?:\/\//, '')
  : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {}, // Turbopack 비활성화
  },
  images: {
    domains: [s3Domain, cdnDomain].filter(Boolean),
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? `${process.env.AWS_CLOUDFRONT_DOMAIN}` : '',
  webpack(config) {
    // 기존 SVG 처리 방식 제거
    config.module.rules = config.module.rules.filter(rule => !rule.test?.toString().includes('svg'));

    // Webpack에서 SVG를 React 컴포넌트로 변환하도록 설정
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: true,
            svgo: false, // SVGO 최적화 비활성화 (SVG 변환 충돌 방지)
          },
        },
      ],
    });

    return config;
  },
};

if (process.env.BUILD_CONTEXT === 'docker') {
  console.log('Disabled eslint and typescript checks on Docker environment');

  if (!nextConfig['eslint']) nextConfig['eslint'] = {};
  if (!nextConfig['typescript']) nextConfig['typescript'] = {};

  nextConfig['eslint']['ignoreDuringBuilds'] = true;
  nextConfig['typescript']['ignoreBuildErrors'] = true;
}

module.exports = nextConfig;
