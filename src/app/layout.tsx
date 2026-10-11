import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'Razzaq Ventures — Build Beyond Today', template: '%s | Razzaq Ventures' },
  description: 'An independent venture studio building thoughtful consumer brands, emerging technology and connected experiences.',
  applicationName: 'Razzaq Ventures',
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
