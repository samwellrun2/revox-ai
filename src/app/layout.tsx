import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ConsentBanner } from "@/components/consent-banner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Revox AI — Your Voice. Any Language.",
  description:
    "Translate any video into 50+ languages with AI voice cloning that preserves the original speaker's voice.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Revox AI — Your Voice. Any Language.",
    description:
      "Translate any video into 50+ languages with AI voice cloning that preserves the original speaker's voice.",
    type: "website",
    siteName: "Revox AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Revox AI — Your Voice. Any Language.",
    description:
      "Translate any video into 50+ languages with AI voice cloning.",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
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
        <ConsentBanner />
      </body>
    </html>
  );
}
