import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import 'lenis/dist/lenis.css';
import CustomCursor from '@/components/layout/CustomCursor';
import SiteShell from '@/components/layout/SiteShell';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import { SITE_CONFIG } from '@/config/site.config';

const cormorant = localFont({
  src: [
    {
      path: '../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-700-normal.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-cormorant',
  display: 'swap',
});

const jost = localFont({
  src: [
    {
      path: '../../node_modules/@fontsource/jost/files/jost-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../node_modules/@fontsource/jost/files/jost-latin-500-normal.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-jost',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} | Luxury Atelier & Beauty Mall`,
  description: SITE_CONFIG.description,
  keywords: [...SITE_CONFIG.keywords],
  authors: [{ name: SITE_CONFIG.name }],
  metadataBase: new URL(SITE_CONFIG.url),
  openGraph: {
    title: `${SITE_CONFIG.name} | Luxury Atelier`,
    description: `${SITE_CONFIG.tagline}. More than a salon. It's a feeling.`,
    siteName: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85',
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/images/logo-emblem-crop.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
  },
};

export const viewport: Viewport = {
  themeColor: '#0c0c0c',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`} data-scroll-behavior="smooth">
      <head>
        <link
          rel="preload"
          as="image"
          href="/hero/sequence/frame_0001.webp"
          type="image/webp"
          fetchPriority="high"
        />
      </head>
      <body>
        {/* Shared SVG filter for the liquid marble backgrounds */}
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
          <defs>
            <filter id="marble" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.0045 0.008" numOctaves={3} seed={7} result="noise">
                <animate attributeName="baseFrequency" dur="18s" values="0.0045 0.008;0.007 0.0035;0.0045 0.008" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale={340} xChannelSelector="R" yChannelSelector="G" result="disp" />
              <feGaussianBlur in="disp" stdDeviation={8} />
            </filter>
          </defs>
        </svg>

        <CustomCursor />
        <SmoothScrollProvider>
          <SiteShell>{children}</SiteShell>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
