"use client";

import { useMemo, useRef, useState } from "react";
import { gsap } from "@/animations";
import { useIsomorphicLayoutEffect, usePrefersReducedMotion } from "@/hooks";

/**
 * Load cover. A solid navy screen carrying the wordmark, wiped away in four
 * diagonal strokes — the way a cloth clears a pane of glass.
 *
 * How the wipe works: the cover is an SVG masked by four straight strokes, all
 * running at 45°. The mask paints black where a stroke lands, so everything it
 * touches turns transparent and reveals the page. Each stroke is drawn by
 * animating `stroke-dashoffset`, so it sweeps along its own length rather than
 * appearing all at once, and consecutive strokes travel in opposite directions
 * the way a hand doubles back.
 *
 * The four bands are cut to equal *area*, not equal width. Diagonal bands
 * across a rectangle are triangles at the two corners and full-width slabs
 * through the middle, so equal-width bands would clear wildly unequal amounts.
 * Solving for equal area makes each stroke clear a true quarter of the screen.
 */

/** Strokes to clear the screen. Four, each taking a quarter. */
const WIPES = 4;
/** How long one stroke takes to travel its length. */
const WIPE_DURATION = 0.4;
/** Gap between stroke starts. Less than the duration, so they overlap slightly. */
const WIPE_STAGGER = 0.3;
/** Beat before the first stroke, so the wordmark registers. */
const DWELL = 0.45;
/** Bands are butted edge to edge; a hair of overlap stops seams showing. */
const SEAM = 1.5;
/** If anything goes wrong, never leave the page covered. */
const SAFETY_MS = 5000;

type Size = { width: number; height: number };
type Band = { d: string; width: number; reverse: boolean };

/**
 * Area of the part of the screen on the left/lower side of the 45° line
 * `x - y = c`. Used to place the band edges so each stroke clears a quarter.
 */
function areaBelow(c: number, width: number, height: number): number {
  const a = Math.min(height, Math.max(0, -c));
  const b = Math.min(height, Math.max(0, width - c));
  return ((b + c) ** 2 - (a + c) ** 2) / 2 + width * (height - b);
}

/** The `c` at which `areaBelow` hits `target`. */
function solveC(target: number, width: number, height: number): number {
  let lo = -height;
  let hi = width;
  for (let i = 0; i < 60; i += 1) {
    const mid = (lo + hi) / 2;
    if (areaBelow(mid, width, height) < target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/**
 * Four parallel 45° bands, ordered right to left. `x - y` is largest at the
 * top-right corner and smallest at the bottom-left, so walking it downwards
 * clears the right of the screen first.
 */
function buildBands({ width, height }: Size): Band[] {
  const total = width * height;

  const edges: number[] = [width];
  for (let k = 1; k < WIPES; k += 1) {
    edges.push(solveC(((WIPES - k) / WIPES) * total, width, height));
  }
  edges.push(-height);

  const bands: Band[] = [];

  for (let i = 0; i < WIPES; i += 1) {
    const hi = edges[i];
    const lo = edges[i + 1];
    if (hi === undefined || lo === undefined) continue;

    const centre = (hi + lo) / 2;
    // Perpendicular distance between two `x - y` levels is their gap over √2.
    const strokeWidth = (hi - lo) / Math.SQRT2 + SEAM;

    // Clip the centreline to a box grown by half the stroke, then run past it
    // so the flat stroke ends sit off screen.
    const pad = strokeWidth / 2 + 24;
    const overshoot = 32;
    const y1 = Math.max(-pad, -pad - centre) - overshoot;
    const y2 = Math.min(height + pad, width + pad - centre) + overshoot;

    bands.push({
      d: `M ${y1 + centre} ${y1} L ${y2 + centre} ${y2}`,
      width: strokeWidth,
      // Alternate direction so the hand doubles back instead of resetting.
      reverse: i % 2 === 1,
    });
  }

  return bands;
}

export function Cover() {
  const [size, setSize] = useState<Size | null>(null);
  const [done, setDone] = useState(false);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  const bands = useMemo(() => (size ? buildBands(size) : []), [size]);

  // Measured before paint, so the first frame already has the full-size SVG.
  useIsomorphicLayoutEffect(() => {
    setSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!size) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      root.style.overflow = previousOverflow;
      setDone(true);
    };

    // Reduced motion gets the page, not a stationary screen it has to wait out.
    const paths = pathRefs.current.filter((path): path is SVGPathElement => path !== null);
    if (prefersReducedMotion || paths.length !== bands.length || paths.length === 0) {
      finish();
      return;
    }

    const timeline = gsap.timeline({ delay: DWELL, onComplete: finish });

    paths.forEach((path, i) => {
      const length = path.getTotalLength();
      // A dash the length of the path hides it entirely; offsetting positive
      // draws from the start, negative draws from the far end.
      const from = bands[i]?.reverse ? -length : length;
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: from });
      timeline.to(
        path,
        { strokeDashoffset: 0, duration: WIPE_DURATION, ease: "power2.inOut" },
        i * WIPE_STAGGER,
      );
    });

    const safety = window.setTimeout(finish, SAFETY_MS);

    return () => {
      window.clearTimeout(safety);
      timeline.kill();
      root.style.overflow = previousOverflow;
    };
  }, [size, bands, prefersReducedMotion]);

  if (done) return null;

  const wordmarkSize = size ? Math.min(16, Math.max(12, size.width * 0.0115)) : 13;

  return (
    <>
      {/* Without JS the wipe never runs, so the cover must not exist at all. */}
      <noscript>
        <style>{`[data-cover]{display:none !important}`}</style>
      </noscript>

      <div
        data-cover
        aria-hidden="true"
        className="fixed inset-0 z-[100]"
        style={size ? undefined : { backgroundColor: "var(--color-navy)" }}
      >
        {size ? (
          <svg
            className="block h-full w-full"
            viewBox={`0 0 ${size.width} ${size.height}`}
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <mask
                id="cover-wipe"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width={size.width}
                height={size.height}
              >
                <rect width={size.width} height={size.height} fill="#fff" />
                {bands.map((band, i) => (
                  <path
                    key={band.d}
                    ref={(el) => {
                      pathRefs.current[i] = el;
                    }}
                    d={band.d}
                    fill="none"
                    stroke="#000"
                    strokeWidth={band.width}
                    // Flat ends and no blur: the wiped edge stays crisp.
                    strokeLinecap="butt"
                  />
                ))}
              </mask>
            </defs>

            <g mask="url(#cover-wipe)">
              <rect width={size.width} height={size.height} style={{ fill: "var(--color-navy)" }} />
              <text
                x={size.width / 2}
                y={size.height / 2}
                // Tracking adds a trailing space that pulls centred text left.
                dx="0.175em"
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                  fill: "var(--color-paper)",
                  fontFamily: "var(--font-body)",
                  fontSize: wordmarkSize,
                  fontWeight: 400,
                  letterSpacing: "0.35em",
                }}
              >
                SCREENOVA SOLUTIONS
              </text>
            </g>
          </svg>
        ) : null}
      </div>
    </>
  );
}
