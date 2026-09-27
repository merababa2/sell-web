import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Fraunces, Noto_Naskh_Arabic, Outfit } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
});

const naskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-naskh",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "OTRO — Modern Kitchen & Coffee · Al Jahra, Kuwait",
  description:
    "OTRO is a modern trattoria and specialty coffee house on Jassem Mohammad Al-Kharafi Rd, Al Jahra. Truffle pizza, wood-fired breads, slow pastas and zero-proof mojitos. Scan the QR on your table to order.",
};

export const viewport: Viewport = {
  themeColor: "#0b0a08",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink font-body text-cream antialiased">
        <div className="grain">{children}</div>
      </body>
    </html>
  );
}
