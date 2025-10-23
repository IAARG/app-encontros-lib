/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações para produção
  output: 'standalone',
  
  // PWA e Mobile App preparation
  experimental: {
    appDir: true,
  },
  
  // Otimizações para web
  images: {
    domains: ['libmatch.com.br', 'www.libmatch.com.br'],
    unoptimized: false,
  },
  
  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // Redirects para domínio personalizado
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/dashboard/admin',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig