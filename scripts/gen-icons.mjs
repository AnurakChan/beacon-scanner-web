// generate PWA icons using canvas API (Node 18+ with canvas package)
// ถ้าไม่มี canvas — สร้าง placeholder SVG แทน
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const iconsDir = join(__dirname, '../public/icons')
mkdirSync(iconsDir, { recursive: true })

// SVG icon สำหรับ beacon scanner
function makeSvg(size) {
  const r = size / 2
  const cx = r
  const cy = r
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#0066cc"/>
  <text x="${cx}" y="${cy + size * 0.12}" font-family="system-ui,sans-serif" font-size="${size * 0.45}" text-anchor="middle" fill="white">📡</text>
</svg>`
}

writeFileSync(join(iconsDir, 'icon-192.svg'), makeSvg(192))
writeFileSync(join(iconsDir, 'icon-512.svg'), makeSvg(512))
console.log('SVG icons written to public/icons/')
