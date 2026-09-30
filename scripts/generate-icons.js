import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Standard icon SVG (Full bleed blue circle with white growth chart)
const standardSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="50%" stop-color="#2563eb" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>
    <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.05" />
    </linearGradient>
  </defs>

  <!-- Blue Circle -->
  <circle cx="256" cy="256" r="236" fill="url(#blueGrad)" />

  <!-- Inner subtle glow ring -->
  <circle cx="256" cy="256" r="236" fill="none" stroke="#60a5fa" stroke-width="6" opacity="0.4" />

  <!-- Base baseline / axis -->
  <line x1="120" y1="360" x2="392" y2="360" stroke="#ffffff" stroke-width="12" stroke-linecap="round" opacity="0.4" />

  <!-- Area under the curve -->
  <path d="M 140 360 L 140 320 L 215 270 L 285 295 L 365 175 L 365 360 Z" fill="url(#areaGrad)" />

  <!-- Growth Line -->
  <polyline
    points="140,320 215,270 285,295 365,175"
    fill="none"
    stroke="#ffffff"
    stroke-width="24"
    stroke-linecap="round"
    stroke-linejoin="round"
  />

  <!-- Upward Trend Arrow Head -->
  <polygon points="365,145 385,195 345,195" fill="#ffffff" />

  <!-- Data points on nodes -->
  <circle cx="140" cy="320" r="14" fill="#ffffff" />
  <circle cx="215" cy="270" r="14" fill="#ffffff" />
  <circle cx="285" cy="295" r="14" fill="#ffffff" />
  <circle cx="365" cy="175" r="16" fill="#ffffff" />
  <circle cx="365" cy="175" r="8" fill="#2563eb" />
</svg>`;

// 2. Maskable icon SVG (with ~15% safe padding for Android icon cropping)
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="blueGradM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="50%" stop-color="#2563eb" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>
    <linearGradient id="areaGradM" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.05" />
    </linearGradient>
  </defs>

  <!-- Full background for safe zone clipping -->
  <rect width="512" height="512" fill="#1e3a8a" />
  <circle cx="256" cy="256" r="210" fill="url(#blueGradM)" />

  <!-- Base baseline / axis -->
  <line x1="140" y1="340" x2="372" y2="340" stroke="#ffffff" stroke-width="10" stroke-linecap="round" opacity="0.4" />

  <!-- Area under the curve -->
  <path d="M 155 340 L 155 305 L 220 265 L 280 285 L 350 185 L 350 340 Z" fill="url(#areaGradM)" />

  <!-- Growth Line -->
  <polyline
    points="155,305 220,265 280,285 350,185"
    fill="none"
    stroke="#ffffff"
    stroke-width="20"
    stroke-linecap="round"
    stroke-linejoin="round"
  />

  <!-- Arrow -->
  <polygon points="350,160 368,202 332,202" fill="#ffffff" />

  <!-- Dots -->
  <circle cx="155" cy="305" r="12" fill="#ffffff" />
  <circle cx="220" cy="265" r="12" fill="#ffffff" />
  <circle cx="280" cy="285" r="12" fill="#ffffff" />
  <circle cx="350" cy="185" r="14" fill="#ffffff" />
  <circle cx="350" cy="185" r="7" fill="#2563eb" />
</svg>`;

async function buildIcons() {
  console.log('Writing public/icon.svg...');
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), standardSvg);

  const stdBuffer = Buffer.from(standardSvg);
  const maskableBuffer = Buffer.from(maskableSvg);

  console.log('Generating pwa-192x192.png...');
  await sharp(stdBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  console.log('Generating pwa-512x512.png...');
  await sharp(stdBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  console.log('Generating pwa-maskable-512x512.png...');
  await sharp(maskableBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  console.log('Generating apple-touch-icon.png (180x180)...');
  await sharp(stdBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  console.log('Generating favicon.png (32x32)...');
  await sharp(stdBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));

  console.log('All PWA icons generated successfully!');
}

buildIcons().catch(err => {
  console.error(err);
  process.exit(1);
});
