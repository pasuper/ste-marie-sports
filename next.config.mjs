import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
    ],
  },
  // Turbopack is now stable in Next.js 15 — config goes here
  turbopack: {},
  // Optimize heavy package imports (tree-shake unused exports)
  experimental: {
    optimizePackageImports: [
      '@payloadcms/ui',
      '@payloadcms/richtext-lexical',
      'lucide-react',
    ],
  },
}

export default withPayload(nextConfig)
