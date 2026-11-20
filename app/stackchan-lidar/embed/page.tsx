import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import PlyPlayground from '../PlyPlayground';
import '../lidar.css';

/* The article's "Try the scan" playground on its own, filling whatever frame another site puts it in:
   <iframe src="https://www.chiambucket.com/stackchan-lidar/embed" allow="fullscreen"></iframe>.
   The nav, footer and painted scene leave it out (lib/embed.ts). */
const sans = Figtree({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--ls-sans', display: 'swap' });

export const metadata: Metadata = {
  title: 'Stack-chan LiDAR scan | Braven Chiam',
  description: 'The 3D scan Stack-chan made of a room, to turn, zoom and recolour.',
  alternates: { canonical: 'https://www.chiambucket.com/stackchan-lidar' },
  robots: { index: false, follow: true },
};

export default function StackchanLidarEmbed() {
  return (
    <main className={`ls ls-embed ${sans.variable}`}>
      <PlyPlayground still="/images/stackchan-lidar/cloud.webp" stillAlt="The finished scan from above: the walls and ceiling of a room corner, with a blue box on the table" />
    </main>
  );
}
