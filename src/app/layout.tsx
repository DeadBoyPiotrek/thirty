import { Navigation } from '@/components/nav/Navigation';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Provider from './_trpc/Provider';
import { getServerSession } from 'next-auth';
import SessionProvider from '../components/session/sessionProvider';
import { authOptions } from './api/auth/[...nextauth]/route';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <SessionProvider session={session}>
          <Provider>{children}</Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
