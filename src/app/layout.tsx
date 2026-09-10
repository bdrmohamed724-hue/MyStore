import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { LocaleProvider } from "@/lib/locale";

export const metadata: Metadata = {
  title: "RYVEN DEPT.",
  description: "Premium fashion & lifestyle. Discover curated collections at RYVEN DEPT.",
  openGraph: {
    title: "RYVEN DEPT.",
    description: "Premium fashion & lifestyle.",
    type: "website",
    siteName: "RYVEN DEPT.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black text-white antialiased min-h-screen font-sans">
        <LocaleProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
