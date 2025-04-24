import { ApolloProvider as ApolloWrapper } from '@/providers/ApolloProvider';
import { SnackbarProvider } from '@/providers/SnackbarProvider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RUDRA',
  description: 'RUDRA - Network Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloWrapper>
            <SnackbarProvider>
              {children}
            </SnackbarProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
