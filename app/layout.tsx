import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PeakClipper — AI Video Clips",
  description: "Turn long videos into viral short clips with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[#f8fafc]">{children}</body>
    </html>
  );
}
