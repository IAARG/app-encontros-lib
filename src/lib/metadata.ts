import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://libmatch.com.br'),
  title: {
    default: 'LibMatch - Relacionamentos Premium',
    template: '%s | LibMatch'
  },
  description: 'Plataforma de relacionamentos premium com classificações Prata, Ouro e Diamante. Encontre conexões especiais com qualidade superior.',
  keywords: ['relacionamentos', 'namoro', 'premium', 'libmatch', 'encontros'],
  authors: [{ name: 'LibMatch Team' }],
  creator: 'LibMatch',
  publisher: 'LibMatch',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://libmatch.com.br',
    title: 'LibMatch - Relacionamentos Premium',
    description: 'Plataforma de relacionamentos premium com classificações Prata, Ouro e Diamante',
    siteName: 'LibMatch',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LibMatch - Relacionamentos Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LibMatch - Relacionamentos Premium',
    description: 'Plataforma de relacionamentos premium com classificações Prata, Ouro e Diamante',
    images: ['/og-image.png'],
    creator: '@libmatch',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
}

export default metadata