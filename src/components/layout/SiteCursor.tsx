"use client";

import { useEffect, useRef } from "react";

/**
 * The pointer, redrawn rather than renamed. What used to sit here was a block
 * of type that read out the name of the section under the mouse; this is the
 * arrow itself — the same shape the operating system draws, in the site's own
 * ink, so the page keeps one pointer and that pointer belongs to the page.
 *
 * Desktop and laptop only, and that is a capability test rather than a width
 * one — `(hover: hover) and (pointer: fine)` is the query that means "there is
 * a mouse here". A touch screen has no cursor to replace. The native arrow is
 * only hidden for the same devices, in `globals.css`, so nothing can leave a
 * machine without a pointer at all. Form fields keep their own I-beam — a text
 * field with no caret is a field you cannot see where you are typing in — which
 * is why the rule there exempts inputs, textareas and selects and why this hides
 * itself over them.
 *
 * Why it does not lag
 * -------------------
 * The old block eased toward the pointer, closing a fraction of the gap each
 * frame. That is deliberate drag, and on an arrow it reads as the machine
 * struggling rather than as a flourish — so the arrow is pinned exactly to the
 * pointer's last known position. No easing, no trail, no distance to make up.
 *
 * Position is still written inside a `requestAnimationFrame` from a ref:
 * mousemove can fire several times between two screen refreshes, and this way
 * a burst of events costs one transform write per frame and no React render at
 * all. Nothing in here sets state, so nothing in here can re-render the page
 * under the mouse.
 *
 * Everything that is *not* position — the lift over a link, the press — is a
 * CSS transition on an inner element, so it can be eased without ever touching
 * the transform that tracks the pointer. The two never fight.
 */

/** Elements that should make the arrow react. Anything clickable, plus the
    opt-in hook `data-cursor="link"` for a clickable thing that is none of these. */
const INTERACTIVE =
  'a, button, [role="button"], summary, label, [data-cursor="link"], input[type="submit"], input[type="button"], input[type="checkbox"], input[type="radio"]';

/** Fields that keep the native I-beam — the ones you type into, and only those.
    Mirrors the exemption in `globals.css`; the two lists have to agree or a
    field ends up with two pointers or none. */
const FIELDS =
  "input:not([type=submit]):not([type=button]):not([type=checkbox]):not([type=radio]), textarea, select";

export function SiteCursor() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The capability test. No mouse, no replacement pointer.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const root = rootRef.current;
    if (!root) return;

    const at = { x: 0, y: 0 };
    let frame = 0;
    let dirty = false;

    const draw = () => {
      frame = requestAnimationFrame(draw);
      if (!dirty) return; // A still mouse costs nothing.
      dirty = false;
      root.style.transform = `translate3d(${at.x}px, ${at.y}px, 0)`;
    };

    const onMove = (event: MouseEvent) => {
      at.x = event.clientX;
      at.y = event.clientY;
      dirty = true;

      // The first reading also reveals it — until the mouse has moved once we
      // do not know where it is, and an arrow parked at 0,0 is a wrong arrow.
      root.dataset.ready = "true";

      const element = event.target instanceof Element ? event.target : null;
      root.dataset.hidden = element?.closest(FIELDS) ? "true" : "false";
      root.dataset.hot = element?.closest(INTERACTIVE) ? "true" : "false";
    };

    const onLeave = () => {
      root.dataset.ready = "false";
    };
    const onEnter = () => {
      root.dataset.ready = "true";
    };
    const onDown = () => {
      root.dataset.down = "true";
    };
    const onUp = () => {
      root.dataset.down = "false";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    // Two elements on purpose. The outer one carries position and nothing else,
    // written every frame from JS; the inner one carries every eased state, in
    // CSS. Mixing them would mean re-composing the easing into each frame's
    // transform, which is exactly how a custom cursor starts to stutter.
    //
    // Above the header — the only other fixed thing on the page — and it never
    // takes a pointer event: it *is* the pointer.
    <div
      ref={rootRef}
      aria-hidden="true"
      data-ready="false"
      className="site-cursor pointer-events-none fixed top-0 left-0 z-[70]"
    >
      <div className="site-cursor__body">
        {/*
          The arrow's tip is the path's origin, so the shape needs no offset to
          land on the pointer. White body, navy edge: the one pairing that holds
          on all four grounds this page has — the dark hero photograph, white
          bands, blue bands, green bands — without the cursor having to know
          which one it is over. Over anything clickable the body turns the
          brand green, which is the same colour every other actionable thing on
          the page already uses.
        */}
        <svg width="22" height="26" viewBox="0 0 20 24" fill="none">
          <path
            d="M0 0 L0 18.6 L4.7 14.2 L7.5 20.5 L10.6 19.1 L7.9 13.1 L14 13 Z"
            className="site-cursor__arrow"
            stroke="var(--color-navy)"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
