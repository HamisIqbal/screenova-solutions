"use client";

import { useEffect, useRef, useState } from "react";
import { navLinks } from "@/content/nav";

/**
 * The pointer, replaced: a small horizontal block that follows the mouse and
 * carries the name of the section it is over. Move from Services down to How It
 * Works and the word in the block changes with the band under it.
 *
 * Desktop and laptop only, and that is a capability test rather than a width
 * one — `(hover: hover) and (pointer: fine)` is the query that means "there is
 * a mouse here". A touch screen never has a cursor to replace, and a tablet
 * reporting a coarse pointer keeps its own. The native cursor is only hidden
 * for the same devices, in `globals.css`, so nothing can leave a machine
 * without a pointer at all.
 *
 * Form fields keep their own cursor. A text field with no caret is a field you
 * cannot see where you are typing in, so the block hides itself over inputs,
 * textareas and selects and the native I-beam comes back — which is why the
 * rule in `globals.css` exempts exactly those three.
 *
 * How it follows
 * --------------
 * The pointer's position is stored on a ref and the block is moved inside a
 * `requestAnimationFrame`, so a mousemove — which can fire far faster than the
 * screen refreshes — never causes more than one write per frame and never
 * causes a React render. It eases towards the pointer rather than being pinned
 * to it: a block of type nailed exactly to the cursor reads as a jitter, and a
 * few frames of lag is what makes it feel like a thing being dragged along.
 *
 * The name comes from the section the pointer is actually over — the `id` of
 * the nearest ancestor `section` of whatever is under it — not from the scroll
 * position, so it is right even when two bands are on screen at once. React is
 * told only when the name changes.
 */

/** How much of the gap to the pointer is closed each frame. */
const EASE = 0.22;
/** Where the block sits relative to the pointer, so it never covers the target. */
const OFFSET_X = 18;
const OFFSET_Y = 14;

/** Sections the nav does not list still get a name. */
const EXTRA_NAMES: Record<string, string> = {
  hero: "Screenova",
  quote: "Free Quote",
  contact: "Contact",
};

const NAMES: Record<string, string> = {
  ...EXTRA_NAMES,
  ...Object.fromEntries(navLinks.map((link) => [link.href.replace("#", ""), link.label])),
};

export function SectionCursor() {
  const blockRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const at = useRef({ x: 0, y: 0 });
  const [label, setLabel] = useState("");
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // The capability test. No mouse, no replacement pointer.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    let started = false;
    let lastLabel = "";
    let lastShown: boolean | null = null;

    const draw = () => {
      frame = requestAnimationFrame(draw);
      const block = blockRef.current;
      if (!block) return;

      at.current.x += (target.current.x - at.current.x) * EASE;
      at.current.y += (target.current.y - at.current.y) * EASE;
      block.style.transform = `translate3d(${at.current.x + OFFSET_X}px, ${
        at.current.y + OFFSET_Y
      }px, 0)`;
    };

    const onMove = (event: MouseEvent) => {
      target.current = { x: event.clientX, y: event.clientY };

      // The first reading is a jump, not an ease — otherwise the block flies in
      // from the corner of the window.
      if (!started) {
        started = true;
        at.current = { ...target.current };
      }

      const element = event.target instanceof Element ? event.target : null;
      const field = element?.closest("input, textarea, select");
      const section = element?.closest("section[id]");
      const name = section ? (NAMES[section.id] ?? "") : "";

      const isShown = !field && name !== "";
      if (isShown !== lastShown) {
        lastShown = isShown;
        setShown(isShown);
      }
      if (name !== lastLabel) {
        lastLabel = name;
        if (name) setLabel(name);
      }
    };

    // Leaving the window entirely takes the block with it.
    const onLeave = () => {
      lastShown = false;
      setShown(false);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={blockRef}
      aria-hidden="true"
      // Above the header, which is the only other fixed thing on the page. It
      // never takes a pointer event — it *is* the pointer.
      // No media variant on the element itself: the effect above returns early
      // on a device with no mouse, so `shown` never becomes true there and the
      // block simply stays at zero opacity, out of the way and out of the
      // pointer's path. One condition, in one place.
      className={`font-title pointer-events-none fixed top-0 left-0 z-[60] rounded-sm bg-(--color-navy) px-2.5 py-1 whitespace-nowrap text-(--color-paper) transition-opacity duration-200 ${
        shown ? "opacity-100" : "opacity-0"
      }`}
      style={{ fontSize: "var(--text-label)", letterSpacing: "0.14em", fontWeight: 500 }}
    >
      {label.toUpperCase()}
    </div>
  );
}
