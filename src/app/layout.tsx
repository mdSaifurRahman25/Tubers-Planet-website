import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: {
    default: "Thumblify",
    template: "%s | Thumblify",
  },
  description: "AI-powered YouTube thumbnail generator.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}