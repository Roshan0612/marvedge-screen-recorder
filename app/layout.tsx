import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marvedge | Record. Explain. Share.",
  description: "Capture your screen, explain your ideas, and share crystal-clear recordings in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen flex flex-col">
          <header className="site-header">
            <div className="site-nav">
              <Link href="/" className="brand"><span className="brand-mark">M</span><span>marvedge</span></Link>
              <nav className="nav-links" aria-label="Primary navigation">
                <Link href="/" className="nav-active">Home</Link>
                <a href="/record">Recorder</a>
              </nav>
              <a href="/record" className="nav-cta">Start recording <span aria-hidden="true">&rarr;</span></a>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="w-full border-t py-3 px-4 text-sm text-gray-500">
            
          </footer>
        </div>
      </body>
    </html>
  );
}
