import { Navigation } from '@/components/nav/Navigation';
import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import Provider from './_trpc/Provider';
import { getServerSession } from 'next-auth';
import SessionProvider from '../components/session/sessionProvider';
import { authOptions } from '@/lib/authOptions';
import { cn } from '@/lib/utils';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});
export const metadata: Metadata = {
  title: 'Target Tracker',
  description: 'Target Tracker is a social media platform for cool people',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className={cn(poppins.className, 'flex flex-col items-center')}>
        <Navigation />
        <SessionProvider session={session}>
          <Provider>
            <main className="max-w-7xl w-full flex flex-col items-center px-3">
              {children}
            </main>
          </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
