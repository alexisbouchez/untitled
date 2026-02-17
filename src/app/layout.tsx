import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hyperbulletin",
  description: "AI-powered newsletters on any topic. Pick a topic, drop your email. Get a crisp AI digest of what matters — curated, summarized, delivered.",
  metadataBase: new URL("https://www.hyperbulletin.com"),
  openGraph: {
    title: "Hyperbulletin",
    description: "AI-powered newsletters on any topic. Pick a topic, drop your email. Get a crisp AI digest of what matters — curated, summarized, delivered.",
    url: "https://www.hyperbulletin.com",
    siteName: "Hyperbulletin",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Hyperbulletin",
    description: "AI-powered newsletters on any topic. Pick a topic, drop your email. Get a crisp AI digest of what matters — curated, summarized, delivered.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
