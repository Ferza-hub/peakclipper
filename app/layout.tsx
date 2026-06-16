import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PeakClipper — AI Video Clips",
  description: "Turn long videos into viral short clips with AI",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PeakClipper",
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className="min-h-full bg-[#f8fafc]">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `if("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js");`,
          }}
        />
      </body>
    </html>
  );
}
