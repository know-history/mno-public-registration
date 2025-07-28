"use client";

import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import "@/lib/config/aws";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
