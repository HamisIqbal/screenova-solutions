/**
 * Generates the placeholder pictures still standing in for real photographs:
 * one per service in the scrolling services stage. The four service-area cities
 * have their photographs and are not generated.
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
 *   node scripts/make-placeholders.mjs
 */

import { deflateSync } from "node:zlib";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const HOME = readFileSync(join(ROOT, "src", "content", "home.ts"), "utf8");

/**
 * The city list, read straight out of the content file so the two cannot drift:
 * every city that has a tile gets a file, and the file names are derived by the
 * same rule the content uses.
 *
 * Each tile is given a blue drawn from the palette, walked around the ramp by
 * index so that neighbours in the grid never land on the same shade — the grid
 * should read as thirty-one distinct places, which is exactly what it will do
 * once the photographs replace these.
 */
/** Palette blues, top colour to bottom colour, cycled across a set. */
const RAMPS = [
  [[16, 42, 78], [8, 18, 34]],
  [[22, 62, 104], [10, 24, 44]],
  [[30, 80, 120], [12, 30, 52]],
  [[18, 52, 92], [9, 20, 38]],
  [[26, 70, 112], [11, 26, 48]],
  [[14, 36, 70], [7, 16, 30]],
  [[34, 92, 132], [13, 34, 58]],
];

/**
 * The one set left, at the shape it is drawn at: a service picture fills half
 * of a tall panel.
 */
const SETS = [
  {
    dir: join(ROOT, "public", "images", "services"),
    width: 1200,
    height: 1500,
    files: [...HOME.matchAll(/^      id: "([^"]+)",$/gm)].map((m) => `${m[1]}.png`),
  },
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
function gradient({ from, to, width, height }) {
  // One filter byte per scanline (0 = None) plus RGB triples.
  const raw = Buffer.alloc(height * (1 + width * 3));
  let p = 0;

  for (let y = 0; y < height; y++) {
    raw[p++] = 0;
    const v = y / (height - 1);

    for (let x = 0; x < width; x++) {
      const lift = 0.18 * (1 - x / (width - 1)) * (1 - v);
      const t = Math.min(1, Math.max(0, v - lift));
      for (let c = 0; c < 3; c++) {
        raw[p++] = Math.round(from[c] + (to[c] - from[c]) * t);
      }
    }
  }
  return raw;
}

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function png({ width, height, from, to }) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour
  // 10-12: compression, filter, interlace — all 0.

  return Buffer.concat([
    SIGNATURE,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(gradient({ from, to, width, height }), { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

for (const set of SETS) {
  mkdirSync(set.dir, { recursive: true });

  set.files.forEach((file, i) => {
    const [from, to] = RAMPS[i % RAMPS.length];
    const buf = png({ width: set.width, height: set.height, from, to });
    writeFileSync(join(set.dir, file), buf);
    console.log(`${file}  ${(buf.length / 1024).toFixed(1)}kB`);
  });
}
