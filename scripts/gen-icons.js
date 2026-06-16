#!/usr/bin/env node
// Generates icon-192.png and icon-512.png using raw PNG binary (no dependencies)
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

function u32be(n) {
  const b = Buffer.alloc(4);
  b.writeUInt32BE(n, 0);
  return b;
}

function crc32(buf) {
  let c = 0xffffffff;
  const table = [];
  for (let i = 0; i < 256; i++) {
    let val = i;
    for (let j = 0; j < 8; j++) val = val & 1 ? 0xedb88320 ^ (val >>> 1) : val >>> 1;
    table[i] = val;
  }
  for (const byte of buf) c = table[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBytes = Buffer.from(type, "ascii");
  const payload = Buffer.concat([typeBytes, data]);
  return Buffer.concat([u32be(data.length), payload, u32be(crc32(payload))]);
}

function makePNG(size) {
  // Brand colours: purple bg #7c3aed, white play triangle
  const R_BG = 0x7c, G_BG = 0x3a, B_BG = 0xed;

  // Build raw RGBA pixel data with filter byte prefix per row
  const rows = [];
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 4);
    row[0] = 0; // filter type: None
    const cx = size / 2, cy = size / 2;
    const r = size * 0.14; // corner radius fraction (for rounding visual feel)
    for (let x = 0; x < size; x++) {
      // Rounded rect mask
      const dx = Math.abs(x - cx) - (size / 2 - r);
      const dy = Math.abs(y - cy) - (size / 2 - r);
      const inRect = dx <= 0 || dy <= 0 || Math.sqrt(Math.max(dx,0)**2 + Math.max(dy,0)**2) <= r;

      let pr = R_BG, pg = G_BG, pb = B_BG, pa = inRect ? 255 : 0;

      // White play triangle
      if (inRect) {
        const nx = (x / size) - 0.5, ny = (y / size) - 0.5;
        const tip = nx > 0.22, left = nx < -0.06;
        const top = ny < -0.22, bot = ny > 0.22;
        // Simple triangle: for each row, triangle spans from left edge to right edge
        const triLeft = -0.08, triH = 0.24;
        const progress = (ny + triH) / (2 * triH); // 0..1 top to bottom
        const triRight = triLeft + progress * 0.34;
        const inTriangle = ny >= -triH && ny <= triH && nx >= triLeft && nx <= triRight;
        if (inTriangle) { pr = 255; pg = 255; pb = 255; }
        void tip; void left; void top; void bot; // suppress unused warnings
      }

      const off = 1 + x * 4;
      row[off] = pr; row[off+1] = pg; row[off+2] = pb; row[off+3] = pa;
    }
    rows.push(row);
  }

  const raw = Buffer.concat(rows);
  const compressed = zlib.deflateSync(raw, { level: 6 });

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = pngChunk("IHDR", Buffer.concat([u32be(size), u32be(size),
    Buffer.from([8, 6, 0, 0, 0])])); // 8-bit RGBA
  const idat = pngChunk("IDAT", compressed);
  const iend = pngChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

const OUT = path.resolve(__dirname, "../public");
for (const size of [192, 512]) {
  const file = path.join(OUT, `icon-${size}.png`);
  fs.writeFileSync(file, makePNG(size));
  console.log(`✓ ${file} (${fs.statSync(file).size} bytes)`);
}
console.log("Done.");
