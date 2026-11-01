/**
 * Run once: node scripts/generate-icons.mjs
 * Generates PNG icons for PWA using sharp (already in most Next.js projects).
 * If sharp is missing: npm install sharp --save-dev
 */
import { createRequire } from 'module'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir    = path.join(__dirname, '..', 'public', 'icons')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

const SIZES = [192, 512, 180, 152]

// Build an SVG for each size then rasterise with sharp
const require = createRequire(import.meta.url)
let sharp
try { sharp = require('sharp') } catch { console.error('Install sharp: npm i -D sharp'); process.exit(1) }

for (const size of SIZES) {
  const pad   = Math.round(size * 0.20)
  const thick = Math.round(size * 0.12)
  const mid   = size / 2
  const r     = Math.round(size * 0.22)

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="#1D9E75"/>
  <rect x="${pad}" y="${pad}" width="${thick}" height="${size - pad * 2}" fill="white"/>
  <rect x="${size - pad - thick}" y="${pad}" width="${thick}" height="${size - pad * 2}" fill="white"/>
  <rect x="${pad + thick}" y="${mid - thick / 2}" width="${size - (pad + thick) * 2}" height="${thick}" fill="white"/>
</svg>`

  const outFile = path.join(outDir, `icon-${size}x${size}.png`)
  await sharp(Buffer.from(svg)).png().toFile(outFile)
  console.log(`✓ ${outFile}`)
}

console.log('Icons generated.')
