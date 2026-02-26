import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

export const viewport: Viewport = {
  themeColor: "#FFB703",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "RoarRank – Master SEO & Rule the Results",
  description:
    "Master Digital Marketing and SEO in 10–12 weeks with daily bite-sized lessons. Join the RoarRank Pride and sharpen your SEO claws today.",
  keywords: ["SEO course", "digital marketing course", "learn SEO", "gamified learning", "SEO India"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RoarRank",
    startupImage: [
      { url: "/icons/splash-640x1136.png", media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" },
      { url: "/icons/splash-750x1334.png", media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" },
      { url: "/icons/splash-1170x2532.png", media: "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" },
      { url: "/icons/splash-1290x2796.png", media: "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" },
    ],
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: "RoarRank – Gamified SEO & Digital Marketing Learning",
    description: "Learn SEO & Digital Marketing with daily lessons, streaks, hearts and XP points. Free forever.",
    type: "website",
    images: [{ url: "/icons/og-image.png", width: 1200, height: 630 }],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="RoarRank" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="mask-icon" href="/favicon.svg" color="#FFB703" />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
