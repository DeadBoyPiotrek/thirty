import { Navigation } from '@/components/nav/Navigation';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Provider from './_trpc/Provider';
import { getServerSession } from 'next-auth';
import SessionProvider from '../components/session/sessionProvider';
import { authOptions } from './api/auth/[...nextauth]/route';
import { cn } from '@/lib/utils';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Thirty',
  description: 'Thirty is a social media platform for cool people',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className={cn(inter.className, 'flex flex-col items-center')}>
        <Navigation />
        <SessionProvider session={session}>
          <Provider>
            <main className="max-w-7xl w-full flex flex-col">{children}</main>
          </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
