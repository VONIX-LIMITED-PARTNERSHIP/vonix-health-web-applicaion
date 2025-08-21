/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // HTTP Strict Transport Security (HSTS)
          // Forces browsers to use HTTPS for future requests to this domain
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // Content Security Policy (CSP)
          // Prevents cross-site scripting (XSS) and other code injection attacks
          // {
          //   key: 'Content-Security-Policy',
          //   value: `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' ${process.env.NEXT_PUBLIC_SUPABASE_URL} https://api.openai.com;`,
          // },
          // X-Content-Type-Options
          // Prevents browsers from MIME-sniffing a response away from the declared content-type
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // X-Frame-Options
          // Prevents clickjacking attacks by controlling whether the page can be rendered in an iframe
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // X-XSS-Protection
          // Enables the XSS filter in older browsers (modern browsers handle this by default)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Referrer-Policy
          // Controls how much referrer information is sent with requests
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
}

export default nextConfig
