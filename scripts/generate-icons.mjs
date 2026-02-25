// scripts/generate-icons.mjs  — run: node scripts/generate-icons.mjs
import sharp from "sharp";
import { readFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.join(__dirname, "../public/icons/mascot-source.png");
const outDir = path.join(__dirname, "../public/icons");
const publicDir = path.join(__dirname, "../public");

mkdirSync(outDir, { recursive: true });
const source = readFileSync(sourcePath);

// ── App icons (all sizes)
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
for (const size of sizes) {
    await sharp(source).resize(size, size).png().toFile(path.join(outDir, `icon-${size}.png`));
    console.log(`✓ icon-${size}.png`);
}

// ── favicon.ico  (just a 32px PNG renamed; browsers accept it)
await sharp(source).resize(32, 32).png().toFile(path.join(publicDir, "favicon.png"));
console.log("✓ favicon.png");

// ── Apple touch icon (180px, no rounded corners — OS applies mask)
await sharp(source).resize(180, 180).png().toFile(path.join(outDir, "apple-touch-icon.png"));
console.log("✓ apple-touch-icon.png");

// ── Splash screens (iPhone sizes — white bg + centered 256px icon)
const splashSizes = [
    { w: 640, h: 1136, name: "splash-640x1136.png" },
    { w: 750, h: 1334, name: "splash-750x1334.png" },
    { w: 1170, h: 2532, name: "splash-1170x2532.png" },
    { w: 1290, h: 2796, name: "splash-1290x2796.png" },
];

const iconBuf = await sharp(source).resize(256, 256).png().toBuffer();
for (const { w, h, name } of splashSizes) {
    await sharp({
        create: { width: w, height: h, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
    })
        .composite([{ input: iconBuf, gravity: "centre" }])
        .png()
        .toFile(path.join(outDir, name));
    console.log(`✓ ${name}`);
}

// ── OG image (1200×630)
const bigIcon = await sharp(source).resize(300, 300).png().toBuffer();
await sharp({
    create: { width: 1200, height: 630, channels: 4, background: { r: 88, g: 204, b: 2, alpha: 1 } },
})
    .composite([{ input: bigIcon, gravity: "centre" }])
    .png()
    .toFile(path.join(outDir, "og-image.png"));
console.log("✓ og-image.png");

console.log("\n🎉 All assets generated!");
