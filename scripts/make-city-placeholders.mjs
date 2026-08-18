/**
 * Generates the placeholder backdrops behind the Cities We Serve rows.
 *
 * They are stand-ins for real photographs of each city, and they exist as files
 * rather than as a CSS gradient so the markup is already the markup it will
 * ship with: `next/image` with a real `src`, a real intrinsic size, and a real
 * srcSet. When the photographs arrive, drop them in `public/images/cities/`
 * under the same names and delete this script — nothing in the component
 * changes.
 *
 * Written with node's own zlib so it pulls in no image library: a PNG is a
 * signature, an IHDR, a deflated stream of filtered scanlines, and an IEND.
 *
 *   node scripts/make-city-placeholders.mjs
 */

import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "images", "cities");

/** Wide enough to stay sharp across a full-bleed row at 2x, and no wider. */
const WIDTH = 1600;
const HEIGHT = 500;

/**
 * One pair per city, top colour to bottom colour. They are all drawn from the
 * palette's blues and navy so a page of placeholders still reads as this site
 * rather than as six random swatches, and each pair is distinct enough that the
 * rows do not look like a rendering bug.
 */
const CITIES = [
  { file: "tampa.png", from: [16, 42, 78], to: [8, 18, 34] },
  { file: "st-petersburg.png", from: [22, 62, 104], to: [10, 24, 44] },
  { file: "clearwater.png", from: [30, 80, 120], to: [12, 30, 52] },
  { file: "brandon.png", from: [18, 52, 92], to: [9, 20, 38] },
  { file: "riverview.png", from: [26, 70, 112], to: [11, 26, 48] },
  { file: "wesley-chapel.png", from: [14, 36, 70], to: [7, 16, 30] },
];

/** CRC-32, the one checksum PNG chunks are framed with. */
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write(type, 4, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])), 0);
  return Buffer.concat([head, data, crc]);
}

/**
 * A vertical gradient with a soft diagonal lift across it, so the rows have
 * some direction in them rather than reading as flat bands — a photograph has
 * a light side, and the text overlay is tuned against one.
 */
function gradient({ from, to }) {
  // One filter byte per scanline (0 = None) plus RGB triples.
  const raw = Buffer.alloc(HEIGHT * (1 + WIDTH * 3));
  let p = 0;

  for (let y = 0; y < HEIGHT; y++) {
    raw[p++] = 0;
    const v = y / (HEIGHT - 1);

    for (let x = 0; x < WIDTH; x++) {
      const lift = 0.18 * (1 - x / (WIDTH - 1)) * (1 - v);
      const t = Math.min(1, Math.max(0, v - lift));
      for (let c = 0; c < 3; c++) {
        raw[p++] = Math.round(from[c] + (to[c] - from[c]) * t);
      }
    }
  }
  return raw;
}

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(WIDTH, 0);
ihdr.writeUInt32BE(HEIGHT, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 2; // colour type: truecolour
// 10-12: compression, filter, interlace — all 0.

mkdirSync(OUT, { recursive: true });

for (const city of CITIES) {
  const png = Buffer.concat([
    SIGNATURE,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(gradient(city), { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  writeFileSync(join(OUT, city.file), png);
  console.log(`${city.file}  ${(png.length / 1024).toFixed(1)}kB`);
}
