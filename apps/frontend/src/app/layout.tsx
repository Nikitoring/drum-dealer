import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Inter, Manrope, Oswald } from 'next/font/google';
import './globals.css';
import '@/components/ui/drm-button.css';
import '@/components/ui/drm-checkbox.css';
import '@/components/ui/drm-input.css';
import '@/components/ui/drm-select.css';
import '@/components/ui/drm-table.css';
import '@/components/ui/drm-textarea.css';
import '@/components/styles/common.css';
import '@/components/site/styles/site.css';
import '@/components/home/styles/home.css';
import '@/components/catalog/styles/catalog.css';
import '@/components/catalog/styles/product.css';
import '@/components/rehearsal/styles/rehearsal.css';
import '@/components/admin/styles/admin.css';
import { QueryProvider } from '@/components/query-provider';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  variable: '--font-inter',
});
const oswald = Oswald({
  subsets: ['latin', 'cyrillic'],
  weight: ['700'],
  variable: '--font-oswald',
});
const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  variable: '--font-manrope',
});
const buran = localFont({
  src: '../../public/fonts/Buran_USSR.ttf',
  weight: '700',
  style: 'normal',
  variable: '--font-buran',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Drum Dealer & Ковры',
  description: 'Музыкальное оборудование из Японии и репетиционные точки «Ковры».',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${oswald.variable} ${manrope.variable} ${buran.variable}`}
    >
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
