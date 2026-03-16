import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { GlobalProvider } from '../context/GlobalProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Campus Connect - MITS Gwalior',
  description: 'Private college social network for MITS Gwalior students.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalProvider>{children}</GlobalProvider>
      </body>
    </html>
  );
}
