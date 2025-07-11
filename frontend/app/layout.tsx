'use client';

import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import '@/lib/aws-config';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}