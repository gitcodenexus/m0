import type { Metadata, Viewport } from "next";
import { Unbounded } from "next/font/google";
import "./globals.css";

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["300", "700"],
  display: "swap",
  variable: "--font-unbounded",
});

export const metadata: Metadata = {
  title: "MO",
  description: "MO – landing page",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={unbounded.variable}>
      <body>{children}</body>
    </html>
  );
}
