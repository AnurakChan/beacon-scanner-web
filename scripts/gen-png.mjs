// สร้าง PNG ขนาด size x size สี solid #0066cc ด้วย Node zlib (ไม่ต้องใช้ library)
import { createDeflate } from 'zlib'
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function crc32(buf) {
  let crc = 0xffffffff
  const table = []
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[i] = c
  }
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeBytes = Buffer.from(type)
  const crcData = Buffer.concat([typeBytes, data])
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(crcData))
  return Buffer.concat([len, typeBytes, data, crcBuf])
}

async function makePng(size, r, g, b) {
  const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8   // bit depth
  ihdr[9] = 2   // RGB
  ihdr[10] = ihdr[11] = ihdr[12] = 0

  // Raw scanlines: filter byte (0) + RGB per pixel
  const rowLen = 1 + size * 3
  const raw = Buffer.alloc(size * rowLen)
  for (let y = 0; y < size; y++) {
    const base = y * rowLen
    raw[base] = 0
    for (let x = 0; x < size; x++) {
      raw[base + 1 + x * 3] = r
      raw[base + 2 + x * 3] = g
      raw[base + 3 + x * 3] = b
    }
  }

  const compressed = await new Promise((res, rej) => {
    const parts = []
    const d = createDeflate()
    d.on('data', (c) => parts.push(c))
    d.on('end', () => res(Buffer.concat(parts)))
    d.on('error', rej)
    d.write(raw)
    d.end()
  })

  return Buffer.concat([
    PNG_SIG,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const iconsDir = join(__dirname, '../public/icons')
mkdirSync(iconsDir, { recursive: true })

const buf192 = await makePng(192, 0x00, 0x66, 0xcc)
const buf512 = await makePng(512, 0x00, 0x66, 0xcc)
writeFileSync(join(iconsDir, '192.png'), buf192)
writeFileSync(join(iconsDir, '512.png'), buf512)
console.log('PNG icons created: 192.png, 512.png')
