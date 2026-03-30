import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
    ],
  },
  // Speed up dev mode
  experimental: {
    // Turbopack is the fast Rust-based bundler (replaces webpack in dev)
    turbo: {},
  },
  // Don't lint during dev builds
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default withPayload(nextConfig)
