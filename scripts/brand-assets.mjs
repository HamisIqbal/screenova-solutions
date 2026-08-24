/**
 * Builds the two brand assets that are not source images: the shared Open Graph
 * card, and the tab icon cropped out of the logo's emblem.
 *
 * Run from the repo root: node <this file>
 */
import sharp from "sharp";
import path from "node:path";

const ROOT = "C:/Users/USER/Downloads/Screenova-Solutions";
const LOGO = path.join(ROOT, "public/images/Screenova-solution-Window-And-Door-Screens-LOGO.png");
const HERO = path.join(
  ROOT,
  "public/images/trendy-modern-interior-living-room-with-blue-walls-white-windows-image-by-wirestock-on-magnific.jpg",
);

/* ---------------------------------------------------------------------- */
/* 1. The Open Graph card, 1200x630.                                       */
/*                                                                         */
/* The hero photograph under a scrim, with the full logo centred on it. The */
/* wordmark is white, so it needs the dark; the scrim is the same idea as   */
/* the one on the hero band itself.                                        */
/* ---------------------------------------------------------------------- */

const OG_W = 1200;
const OG_H = 630;
const LOGO_W = 820;

const logoOnCard = await sharp(LOGO).resize({ width: LOGO_W }).toBuffer();
const logoMeta = await sharp(logoOnCard).metadata();

const scrim = await sharp({
  create: {
    width: OG_W,
    height: OG_H,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0.62 },
  },
})
  .png()
  .toBuffer();

await sharp(HERO)
  .resize({ width: OG_W, height: OG_H, fit: "cover", position: "center" })
  .composite([
    { input: scrim, top: 0, left: 0 },
    {
      input: logoOnCard,
      top: Math.round((OG_H - logoMeta.height) / 2),
      left: Math.round((OG_W - LOGO_W) / 2),
    },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(path.join(ROOT, "public/og.jpg"));

console.log("og.jpg written");

/* ---------------------------------------------------------------------- */
/* 2. The tab icon.                                                        */
/*                                                                         */
/* The logo is 3:1 and two thirds of it is a wordmark, which is illegible  */
/* at 16px. The emblem on its left — the circle with the sun, the window,  */
/* the palm and the water — is the part that survives being small, so the  */
/* icon is a square crop of exactly that.                                  */
/*                                                                         */
/* Extraction box measured off the source: the emblem sits inside roughly  */
/* x 24-762, y 65-660 of the 2172x724 original.                            */
/* ---------------------------------------------------------------------- */

const EMBLEM = { left: 43, top: 12, width: 700, height: 700 };

// Transparent, for the browser tab: it sits on whatever the tab bar is, and
// the emblem carries its own colour.
await sharp(LOGO)
  .extract(EMBLEM)
  .resize({ width: 256, height: 256 })
  .png()
  .toFile(path.join(ROOT, "src/app/icon.png"));

console.log("icon.png written");

// Apple flattens transparency onto black, which loses the window's white
// frame, so this one is given its own white ground.
await sharp(LOGO)
  .extract(EMBLEM)
  .resize({ width: 156, height: 156 })
  .extend({
    top: 12,
    bottom: 12,
    left: 12,
    right: 12,
    background: { r: 255, g: 255, b: 255, alpha: 1 },
  })
  .flatten({ background: { r: 255, g: 255, b: 255 } })
  .png()
  .toFile(path.join(ROOT, "src/app/apple-icon.png"));

console.log("apple-icon.png written");
