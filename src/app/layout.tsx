import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Revox AI — Your Voice. Any Language.",
  description:
    "Translate any video into 50+ languages with AI voice cloning that preserves the original speaker's voice.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-brand-bg text-brand-text font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
