/**
 * Motion tokens for JS-driven animation. These mirror the CSS custom properties
 * in `src/styles/tokens.css` — change both together so CSS transitions and
 * GSAP/Motion tweens stay in sync.
 */

export const duration = {
  fast: 0.2,
  base: 0.5,
  slow: 0.9,
} as const;

/** Cubic-bezier control points, the shape both GSAP and Motion accept. */
export const ease = {
  outExpo: [0.16, 1, 0.3, 1],
  inOutQuart: [0.76, 0, 0.24, 1],
} as const;

/** Stagger steps for grouped reveals. */
export const stagger = {
  tight: 0.04,
  base: 0.08,
  loose: 0.16,
} as const;
