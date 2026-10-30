import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import ClientEffects from '../components/ClientEffects';
import ArticleLightbox from '../components/ArticleLightbox';
import SceneShell from '../components/SceneShell';
import GlassDefs from '../components/GlassDefs';
import { THEME_MAP, DEFAULT_THEME } from '../lib/theme';
import './sunlit.css';
import './scenes.css';

export const viewport: Viewport = {
  themeColor: '#000000',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.chiambucket.com'),
  authors: [{ name: 'Braven Chiam' }],
  icons: { icon: '/images/icon.png' },
  openGraph: {
    siteName: 'Chiambucket',
    type: 'website',
    images: [{ url: '/images/logo.png' }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Set the page's theme (and .is-day / .is-night) before paint to avoid a colour flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var m=${JSON.stringify(THEME_MAP)};var p=location.pathname;if(p.length>1&&p.slice(-1)==='/')p=p.slice(0,-1);var d=document.documentElement;var t=m[p]||${JSON.stringify(DEFAULT_THEME)};d.setAttribute('data-theme',t);d.classList.add('sensory-active',(t==='night'||t==='dusk')?'is-night':'is-day');var u=navigator.userAgentData;if(u&&u.brands&&u.brands.some(function(b){return /Chrom/.test(b.brand)}))d.classList.add('lg-refract');})();`,
          }}
        />
        <link rel="stylesheet" href="/mainstyle.css" />
      </head>
      <body>
        <ClientEffects />
        <ArticleLightbox />
        <SceneShell />
        <GlassDefs />
        <Nav />
        {children}
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
