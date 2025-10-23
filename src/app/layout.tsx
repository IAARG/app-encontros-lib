import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LibMatch - Plataforma de Relacionamentos Premium',
  description: 'Conecte-se com pessoas especiais através da nossa plataforma premium de relacionamentos',
  keywords: 'relacionamentos, namoro, encontros, premium, libmatch',
  authors: [{ name: 'LibMatch Team' }],
  creator: 'LibMatch',
  publisher: 'LibMatch',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://libmatch.com.br'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'LibMatch - Plataforma de Relacionamentos Premium',
    description: 'Conecte-se com pessoas especiais através da nossa plataforma premium de relacionamentos',
    url: 'https://libmatch.com.br',
    siteName: 'LibMatch',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LibMatch - Plataforma de Relacionamentos Premium',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LibMatch - Plataforma de Relacionamentos Premium',
    description: 'Conecte-se com pessoas especiais através da nossa plataforma premium de relacionamentos',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/apple-icon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ec4899" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LibMatch" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}