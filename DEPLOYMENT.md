# 🦁 RoarRank - Deployment Guide

RoarRank is optimized for deployment on **Vercel**. Follow this guide to go live with the "Lion Pride" theme.

## 🚀 One-Click Deploy
The easiest way to deploy is by connecting your GitHub repository to [Vercel](https://vercel.com).

## 🛠️ Build Configuration
Vercel will auto-detect Next.js. I have already pre-configured the project with:
- **Build Command:** `npm run build` (which uses `next build --webpack` for PWA support)
- **Output Directory:** `.next`
- **Install Command:** `npm install`

## 💎 Pre-Deployment Checklist
Before you click deploy, make sure you've handled these:

1. **Audio Assets**: Ensure you've uploaded your `.mp3` files to `/public/sounds/`:
   - `roar.mp3`
   - `success.mp3`
   - `error.mp3`
   - `step.mp3`
2. **Icons**: Check that `/public/` contains your `favicon.ico` and PNG icons defined in `manifest.json`.
3. **PWA Headers**: I have added a `vercel.json` to handle the Service Worker cache correctly.

## 📈 Environment Variables (Optional)
If you want to add tracking or analytics later, add these in the Vercel Dashboard:
- `NEXT_PUBLIC_APP_URL`: Your production domain (e.g., `https://roarrank.com`)
- `NEXT_PUBLIC_ANALYTICS_ID`: If using Google Analytics or similar.

## 📱 PWA Support
Once deployed, opening the site on mobile (Chrome/Safari) will prompt the user to **"Add to Home Screen"**. This gives them the full "App" experience with your custom lion icon.

---
**Roar with Pride!** 🦁👑
