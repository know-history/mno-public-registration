import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import { ModalProvider } from "@/contexts/ModalContext";
import { GlobalModals } from '@/components/ui/GlobalModals';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'MNO Registry Applications',
  description: 'Métis Nation of Ontario Registry - Apply for citizenship and harvesting rights',
  keywords: 'MNO, Métis Nation of Ontario, citizenship, harvesting, registry, applications',
  authors: [{ name: 'Métis Nation of Ontario' }],
  robots: 'index, follow',
  openGraph: {
    title: 'MNO Registry Applications',
    description: 'Apply for MNO citizenship and harvesting rights online',
    type: 'website',
    url: 'https://registry.metisnation.org',
    siteName: 'MNO Registry',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MNO Registry Applications',
    description: 'Apply for MNO citizenship and harvesting rights online',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ModalProvider>
            {children}
            <GlobalModals />
          </ModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}