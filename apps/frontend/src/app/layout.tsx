import type { Metadata } from 'next';
import localFont from 'next/font/local';
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

const inter = localFont({
  src: [
    {
      path: '../../public/fonts/Inter_18pt-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Inter_18pt-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
});

const oswald = localFont({
  src: [
    {
      path: '../../public/fonts/Oswald-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Oswald-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-oswald',
  display: 'swap',
});

const manrope = localFont({
  src: [
    {
      path: '../../public/fonts/Manrope-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Manrope-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-manrope',
  display: 'swap',
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
  icons: {
    icon: [{ url: '/favicon/favicon.ico', type: 'ico' }],
    shortcut: '/favicon/favicon-32x32.png',
    apple: '/favicon/apple-touch-icon',
  },
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
