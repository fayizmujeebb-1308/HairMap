import type { Metadata, Viewport } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import './globals.css'
import ServiceWorkerRegistrar from '@/app/components/ServiceWorkerRegistrar'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-dm-serif',
})

export const metadata: Metadata = {
  title: 'HairMap — Track & Restore Your Hair',
  description: 'Professional hair health tracking, AI-powered photo analysis, and long-term progress monitoring for men fighting hair loss.',
  manifest: '/manifest.json',
  openGraph: {
    title: 'HairMap — Track & Restore Your Hair',
    description: 'AI-powered hair health tracking. Log treatments, monitor progress with photos, and get personalised coaching.',
    url: 'https://hair-map.vercel.app',
    siteName: 'HairMap',
    images: [
      {
        url: 'https://hair-map.vercel.app/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'HairMap — Professional hair health tracking',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HairMap — Track & Restore Your Hair',
    description: 'AI-powered hair health tracking. Log treatments, monitor progress, get coaching.',
    images: ['https://hair-map.vercel.app/opengraph-image'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent', // lets content sit under the status bar
    title: 'HairMap',
  },
  formatDetection: {
    telephone: false, // stop iOS auto-linking phone numbers
    date: false,
    email: false,
    address: false,
  },
}

export const viewport: Viewport = {
  themeColor: '#10b981',
  width: 'device-width',
  initialScale: 1,
  // Cover the notch / Dynamic Island / home indicator
  viewportFit: 'cover',
}

// Inline script: apply saved theme before first paint — prevents any flash.
// Valid themes: blossom (default), clinical, mint, calm-blue, lavender, sand,
//               dark, midnight, high-contrast, system
const themeScript = `
  try {
    var VALID = ['blossom','clinical','mint','calm-blue','lavender','sand','dark','midnight','high-contrast','system'];
    var t = localStorage.getItem('hairmap-theme');
    // Default to blossom when no preference saved
    var theme = (t && VALID.indexOf(t) !== -1) ? t : 'blossom';
    document.documentElement.setAttribute('data-theme', theme);
  } catch(e) {
    document.documentElement.setAttribute('data-theme', 'blossom');
  }
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Anti-FOUT theme script */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* iOS PWA */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="HairMap" />

        {/* Touch icons — iOS uses these for the home screen shortcut */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

        {/* Splash screens (optional — iOS generates them automatically in iOS 12+) */}
      </head>
      <body className={`${dmSans.variable} ${dmSerif.variable} font-sans antialiased`}>
        <ServiceWorkerRegistrar />
        {children}
      </body>
    </html>
  )
}
