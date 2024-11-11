// layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { navigation } from "@/data/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: navigation.site_name,
  description: navigation.site_description,
};

export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden min-h-dvh max-w-dvw`}
      >
        <Navbar />
        <div className="container py-2 md:px-10 px-2 pb-32 min-h-dvh max-w-dvw">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
