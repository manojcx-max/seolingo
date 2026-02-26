import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
    // Cache strategies
    runtimeCaching: [
      {
        // Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts-cache",
          expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        // Cache all JS + CSS + images from our own domain
        urlPattern: /\.(js|css|png|jpg|jpeg|svg|ico|woff2?)$/,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-resources",
          expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
        },
      },
      {
        // App pages — Network first, fall back to cache
        urlPattern: /^\//,
        handler: "NetworkFirst",
        options: {
          cacheName: "pages-cache",
          expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
          networkTimeoutSeconds: 3,
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  /* Optimizations */
  reactStrictMode: true,
  // Ensure we use webpack explicitly for PWA plugin compatibility if needed
  webpack: (config) => {
    return config;
  },
  experimental: {
    // This helps Next.js handle PWA plugin more gracefully in some versions
  }
};

export default process.env.NODE_ENV === "development" ? nextConfig : withPWA(nextConfig);

