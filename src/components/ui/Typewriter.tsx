"use client";

import { Fragment, useEffect, useMemo, useRef } from "react";
import { gsap } from "@/animations";
import { usePrefersReducedMotion } from "@/hooks";
import { useRevealed } from "./CardStage";

/**
 * Types a line of text out one character at a time when `play` turns true.
 *
 * Three constraints shaped this, and all three are the reason it is not the
 * usual `setInterval` that appends to a string:
 *
 *   The text must be in the HTML. A typewriter built by appending to state
 *   ships an empty element to the crawler and to anyone whose JavaScript fails.
 *   Here the full string renders on the server; the split into characters only
 *   happens after mount, which is also what keeps hydration clean.
 *
 *   The layout must not move. Characters are already in the box at their final
 *   positions and only their opacity changes, so nothing reflows as the line
 *   fills in and the card beneath it never jumps.
 *
 *   Wrapping must still work. Splitting a heading into 30 loose inline-blocks
 *   lets the browser break between any two letters. Words are grouped into
 *   their own inline-block and the spaces between them stay real text nodes, so
 *   the line breaks exactly where it would have without any of this.
 *
 * The visible characters are `aria-hidden` and the real string is repeated in
 * an `sr-only` span, so a screen reader is handed the finished sentence rather
 * than being walked through it letter by letter.
 *
 * Reduced motion opts out entirely — it never splits, and the plain text it
 * rendered on the server is what stays on the page.
 *
 * Typing starts when the card it is standing in arrives, which it learns from
 * `useRevealed()` rather than from a prop — the sections are Server Components
 * and cannot pass a callback or a live value down. Outside a card that hook
 * returns true and the line types on mount.
 */
export function Typewriter({
  text,
  className = "",
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const play = useRevealed();
  const prefersReducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLSpanElement>(null);
  const played = useRef(false);

  // The split is derived, not stored, and it is keyed to `play` rather than to
  // "has mounted". That is what keeps the server and the first client render
  // agreeing on plain text — `play` is false on both — without an effect that
  // sets state on mount just to flip the rendering mode.
  const split = play && !prefersReducedMotion;

  useEffect(() => {
    const root = rootRef.current;
    if (!split || !root || played.current) return;
    played.current = true;

    const chars = root.querySelectorAll<HTMLElement>("[data-char]");
    const caret = root.querySelector<HTMLElement>("[data-caret]");

    // `duration: 0` with a stagger is the whole effect: each character is
    // switched on rather than faded in, which is what reads as a keystroke
    // instead of a dissolve. 26ms a character puts a six-word heading at about
    // three quarters of a second — fast enough to finish inside the card's own
    // entrance and slow enough to be legible as typing.
    const timeline = gsap.timeline();
    timeline.to(chars, { opacity: 1, duration: 0, stagger: 0.026, ease: "none" });

    if (caret) timeline.to(caret, { opacity: 0, duration: 0.25 }, ">+=0.4");

    return () => {
      timeline.kill();
    };
  }, [split]);

  const words = useMemo(() => text.split(" "), [text]);

  if (!split) {
    return (
      <span className={className} style={style}>
        {text}
      </span>
    );
  }

  return (
    <span ref={rootRef} className={className} style={style}>
      <span className="sr-only">{text}</span>

      <span aria-hidden="true">
        {words.map((word, wordIndex) => (
          <Fragment key={`${word}-${wordIndex}`}>
            <span className="inline-block">
              {[...word].map((character, charIndex) => (
                <span key={charIndex} data-char className="inline-block opacity-0">
                  {character}
                </span>
              ))}
            </span>
            {/* A real space, outside the word box, so the line still breaks here. */}
            {wordIndex < words.length - 1 ? " " : null}
          </Fragment>
        ))}

        {/* The caret. `bg-current` so it is whatever colour the heading is on
            whatever ground the card is standing on. */}
        <span
          data-caret
          className="caret-blink ml-1 inline-block h-[0.85em] w-[0.09em] translate-y-[0.07em] bg-current align-baseline"
        />
      </span>
    </span>
  );
}
