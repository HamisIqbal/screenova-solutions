/**
 * Generates the stand-in photographs that sit behind each card stage.
 *
 * Every card in Services, How It Works, Why Choose Us and Screen Options names
 * an image in `src/content/home.ts`, and each of those entries carries a
 * `detail` line describing the real photograph that belongs there. Until those
 * photographs arrive, this script writes a placeholder to the same path so the
 * layout, the cross-fade and the contrast maths can all be built and checked
 * against something real.
 *
 * They are JPEGs rather than SVGs on purpose: `next/image` refuses SVG without
 * `dangerouslyAllowSVG`, and the point of a placeholder is that swapping in the
 * real photograph is a file copy and nothing else. Same path, same format, same
 * 8:5 box — drop the real image over it and no code changes.
 *
 * Run with:  node scripts/generate-placeholders.mjs
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const OUT_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "images",
  "placeholders",
);

/** The stage box. 8:5 is wide enough to survive `object-cover` on any band. */
const WIDTH = 1600;
const HEIGHT = 1000;

/**
 * One gradient per section, so during development the cross-fade between cards
 * is visible at a glance and it is obvious which stage you are looking at. The
 * real photographs will not match these and are not meant to.
 *
 * They are all light, and that is the one thing about them that is not
 * arbitrary. The backdrop composites with `mix-blend-multiply`, so how dark a
 * placeholder is decides how far it drags the band down — a navy gradient at
 * 12% turns the white bands visibly grey and makes the layout look wrong for
 * reasons that have nothing to do with the layout. Daylight photographs of
 * windows and screens are light, so the stand-ins are too, and the page looks
 * during development roughly like it will look afterwards.
 */
const SECTIONS = {
  services: { from: "#6fb6ff", to: "#f1f6fc", label: "Services" },
  "how-it-works": { from: "#eef4ff", to: "#9ec6f5", label: "How It Works" },
  "why-us": { from: "#f1f6fc", to: "#8fc6ff", label: "Why Choose Us" },
  "screen-options": { from: "#eef4ff", to: "#bfe0b4", label: "Screen Options" },
};

/** slug -> section key. Mirrors the `image.src` values in `content/home.ts`. */
const IMAGES = {
  "new-window-screens": "services",
  "window-rescreening": "services",
  "window-screen-repair": "services",
  "sliding-screen-door-rescreening": "services",
  "pet-resistant-screens": "services",
  "solar-screens": "services",

  "tell-us-what-you-need": "how-it-works",
  "get-your-quote": "how-it-works",
  "measure-and-build": "how-it-works",
  "professional-installation": "how-it-works",

  "custom-fit": "why-us",
  "quality-materials": "why-us",
  "convenient-service": "why-us",
  "multiple-screen-options": "why-us",
  "local-tampa-bay-service": "why-us",
  "free-quotes": "why-us",

  "standard-fiberglass-screen": "screen-options",
  "pet-resistant-screen": "screen-options",
  "solar-screen": "screen-options",
  "additional-screen-options": "screen-options",
};

/** Title-cases a slug back into something readable for the plate. */
function titleize(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * A screen-mesh weave, which is the one motif this company can borrow without
 * pretending to be a photograph. Angled so it never lines up with the pixel
 * grid and moirés.
 */
function mesh(seed) {
  const gap = 22 + (seed % 5) * 4;
  return `
    <pattern id="mesh" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse"
             patternTransform="rotate(${12 + (seed % 4) * 9})">
      <path d="M0 0 H${gap} M0 0 V${gap}" stroke="#0b6fe8" stroke-opacity="0.14" stroke-width="1.5"/>
    </pattern>`;
}

function svg(slug, section) {
  const seed = [...slug].reduce((total, char) => total + char.charCodeAt(0), 0);
  const angle = 20 + (seed % 7) * 15;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
    <defs>
      <linearGradient id="bg" gradientTransform="rotate(${angle})">
        <stop offset="0%" stop-color="${section.from}"/>
        <stop offset="100%" stop-color="${section.to}"/>
      </linearGradient>
      ${mesh(seed)}
      <radialGradient id="glow" cx="${25 + (seed % 5) * 12}%" cy="35%" r="70%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.30"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <rect width="100%" height="100%" fill="url(#bg)"/>
    <rect width="100%" height="100%" fill="url(#mesh)"/>
    <rect width="100%" height="100%" fill="url(#glow)"/>

    <g font-family="Arial, Helvetica, sans-serif" fill="#071a2f">
      <text x="80" y="${HEIGHT - 132}" font-size="34" letter-spacing="8" opacity="0.34">PLACEHOLDER</text>
      <text x="80" y="${HEIGHT - 68}" font-size="64" font-weight="700" opacity="0.42">${titleize(slug)}</text>
    </g>
  </svg>`;
}

await mkdir(OUT_DIR, { recursive: true });

for (const [slug, sectionKey] of Object.entries(IMAGES)) {
  const buffer = await sharp(Buffer.from(svg(slug, SECTIONS[sectionKey])))
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

  await writeFile(join(OUT_DIR, `${slug}.jpg`), buffer);
  console.log(`wrote ${slug}.jpg`);
}

console.log(`\n${Object.keys(IMAGES).length} placeholders in public/images/placeholders/`);
