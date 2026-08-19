"use client";

import { useEffect, useRef, useState } from "react";
import { navLinks } from "@/content/nav";
import { usePrefersReducedMotion } from "@/hooks";

/**
 * A wheel of section names on the right of the window, turned by the scroll.
 *
 * The names sit on the rim of a circle whose centre is off the right edge of
 * the screen, so what you see is the wheel edge-on: the section you are in is
 * at the near point of the rim, level with the middle of the window, and the
 * ones before and after it curve away above and below, tipping and receding as
 * they go. Scrolling turns the wheel. It is the same information a scrollbar
 * carries — where you are in the page, and what is either side of you — said in
 * words instead of in a bar, and it leaves the whole left of the window to the
 * sections themselves.
 *
 * Desktop only, from `xl` up: it wants room the page's measure is not using,
 * and it is a pointer's affordance. Below that it renders nothing.
 *
 * How the turn is worked out
 * --------------------------
 * Not by "which section is on screen" — that snaps, and a wheel that snaps is a
 * list that jumps. Every section's centre is measured once in document
 * coordinates, and the wheel's position is where the middle of the window falls
 * *between* two of those centres: halfway between Services and How It Works is
 * position 0.5, and the wheel is genuinely half a step round. The turn is
 * continuous, and it is driven by the scroll rather than chasing it — no
 * easing, no lag, and it stops the instant the page does.
 *
 * Each name is then placed by its distance from that position: `sin` walks it
 * down the rim, `cos` pulls it back towards the centre, it tilts by the same
 * angle, and opacity and scale fall away with the distance so the far names
 * fade rather than pile up at the edges. Those are written straight onto the
 * elements inside a `requestAnimationFrame` — a React re-render per scroll
 * frame is the one thing that would make this stutter. React is told only when
 * the *nearest* name changes, which happens a few times in a page.
 *
 * It is not there at the top. The hero is a full window of photograph and a
 * wheel of names over it is furniture on the front door; it fades in once you
 * are past it, which is also the moment it has something to say.
 *
 * Under `prefers-reduced-motion` the rim is flattened: the names stack as a
 * plain list, the current one is marked, and nothing turns or tilts.
 */

/** Degrees of rim between one name and the next. */
const STEP = 18;
/** How far away the rim's centre is, in pixels. Bigger is a flatter wheel. */
const RADIUS = 300;
/** Names further than this many steps from the current one have gone. */
const REACH = 3.2;

export function SectionWheel() {
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const sections = navLinks.map((link) => document.querySelector<HTMLElement>(link.href));

    // Document coordinates, measured once and again on resize. Reading them per
    // frame would be a layout read on every scroll tick.
    let centres: number[] = [];
    const measure = () => {
      centres = sections.map((section) => {
        if (!section) return Number.POSITIVE_INFINITY;
        const box = section.getBoundingClientRect();
        return box.top + window.scrollY + box.height / 2;
      });
    };

    /** Where the middle of the window sits, in "index of section" units. */
    const position = () => {
      const middle = window.scrollY + window.innerHeight / 2;
      const first = centres[0] ?? 0;
      const last = centres[centres.length - 1] ?? 0;

      if (middle <= first) return 0;
      if (middle >= last) return centres.length - 1;

      for (let i = 0; i < centres.length - 1; i += 1) {
        const from = centres[i] ?? 0;
        const to = centres[i + 1] ?? 0;
        if (middle >= from && middle < to) return i + (middle - from) / (to - from || 1);
      }

      return centres.length - 1;
    };

    let frame = 0;
    let lastCurrent = -1;
    let lastVisible: boolean | null = null;

    const render = () => {
      frame = 0;
      const p = position();

      const nearest = Math.round(p);
      if (nearest !== lastCurrent) {
        lastCurrent = nearest;
        setCurrent(nearest);
      }

      // Past the hero, which is the first window of the page.
      const isVisible = window.scrollY > window.innerHeight * 0.45;
      if (isVisible !== lastVisible) {
        lastVisible = isVisible;
        setVisible(isVisible);
      }

      if (prefersReducedMotion) return;

      itemsRef.current.forEach((item, i) => {
        if (!item) return;

        const steps = i - p;
        const angle = (steps * STEP * Math.PI) / 180;
        const reach = Math.min(Math.abs(steps) / REACH, 1);

        const y = Math.sin(angle) * RADIUS;
        const x = (1 - Math.cos(angle)) * RADIUS * 0.55;

        item.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${
          steps * STEP * 0.55
        }deg) scale(${1.15 - reach * 0.45})`;
        item.style.opacity = `${Math.max(0, 1 - reach * reach)}`;
        // Only the name at the near point takes the pointer; the rest are
        // further round the rim and would be hit targets over the page.
        item.style.pointerEvents = Math.abs(steps) < 0.5 ? "auto" : "none";
      });
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    render();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    // The bands are photographs; their heights settle as the pictures arrive.
    window.addEventListener("load", onResize);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      data-ground="sky"
      // `right-6` and a single small type size keep the widest name inside the
      // margin the 72rem measure leaves at this breakpoint, so the wheel never
      // sits over the page it is indexing.
      className={`pointer-events-none fixed top-1/2 right-6 z-40 hidden -translate-y-1/2 bg-transparent transition-opacity duration-700 xl:block ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <nav aria-label="Sections">
        <ul
          className={
            prefersReducedMotion ? "flex flex-col items-end gap-3" : "relative block h-0 w-56"
          }
        >
          {navLinks.map((link, i) => (
            <li
              key={link.href}
              className={prefersReducedMotion ? "" : "absolute top-0 right-0 w-56"}
            >
              <a
                ref={(el) => {
                  itemsRef.current[i] = el;
                }}
                href={link.href}
                aria-current={i === current ? "true" : undefined}
                // `origin-right` so the tilt pivots on the edge the names are
                // ranged against rather than swinging their ends about.
                className={`font-title pointer-events-auto block origin-right text-right whitespace-nowrap no-underline transition-colors duration-300 ${
                  i === current ? "text-(--on-ground)" : "text-(--on-ground)/55"
                }`}
                style={{
                  fontSize: "var(--text-label)",
                  fontWeight: i === current ? 500 : 400,
                  letterSpacing: "0.14em",
                  // The names have no panel behind them — they sit straight on
                  // the page — so a soft shadow is what keeps them legible over
                  // white paper as well as over the photographs.
                  textShadow: "0 1px 12px rgba(0,0,0,0.65)",
                }}
              >
                {link.label.toUpperCase()}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
