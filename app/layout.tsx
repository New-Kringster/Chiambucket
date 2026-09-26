import type { Metadata, Viewport } from 'next';
import { Host_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import './swiss.css';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import ClientEffects from '../components/ClientEffects';
import ArticleLightbox from '../components/ArticleLightbox';
import SensoryShell from '../components/SensoryShell';
import { THEME_MAP, PRESS_ROUTES } from '../lib/theme';

/* Swiss typography: one grotesque, Host Grotesk, in a range of weights. */
const grotesk = Host_Grotesk({
  subsets: ['latin'],
  variable: '--font-grotesk',
  display: 'swap',
});

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
    <html lang="en" className={grotesk.variable} suppressHydrationWarning>
      <head>
        {/* Before paint: set the accent theme, and pick the press (paper) or
            sensory (dark field) look for this route so neither flashes. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var m=${JSON.stringify(THEME_MAP)};var pr=${JSON.stringify(PRESS_ROUTES)};var p=location.pathname;if(p.length>1&&p.slice(-1)==='/')p=p.slice(0,-1);var d=document.documentElement;d.setAttribute('data-theme',m[p]||'paper');d.classList.add(pr.indexOf(p)>-1?'press':'sensory-active');})();`,
          }}
        />
        <link rel="stylesheet" href="/mainstyle.css" />
      </head>
      <body>
        <ClientEffects />
        <ArticleLightbox />
        <SensoryShell />
        <Nav />
        {children}
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
