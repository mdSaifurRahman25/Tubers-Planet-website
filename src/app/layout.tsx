import type { Metadata } from "next";
import type { ReactNode } from "react";

import "lenis/dist/lenis.css";
import "./globals.css";

import Providers from "./providers";

export const metadata: Metadata = {
  title: {
    default: "Thumblify",
    template: "%s | Thumblify",
  },
  description:
    "Create professional YouTube thumbnails with AI.",
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