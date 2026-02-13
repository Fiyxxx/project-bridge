import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import PrivacyBanner from '@/components/PrivacyBanner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AssessMate - AI Case Note Assistant',
  description: 'AI-powered documentation assistant for early intervention assessors',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PrivacyBanner />
        {children}
      </body>
    </html>
  );
}
