"use client";

import { useRef } from "react";
import { gsap } from "@/animations";
import { useIsomorphicLayoutEffect, usePrefersReducedMotion } from "@/hooks";

/**
 * The container inside every band, and the one thing on the page that makes
 * text arrive rather than simply be there: each block of copy fades up as it
 * comes into the window, and fades back out if you scroll up past it.
 *
 * It is wired into `Section` rather than sprinkled through the sections, so a
 * band gets the behaviour by being a band. No section names an animation and
 * none of them had to change.
 *
 * What counts as a block, and what is skipped
 * ------------------------------------------
 * Blocks are the direct children of the measure — a header, a paragraph stack,
 * a grid — so copy that belongs together arrives together. Lists are the one
 * exception: an `ol`/`ul` hands its items over instead, so a list reveals item
 * by item as you travel down it rather than all at once from the top.
 *
 * Three kinds of child are left alone:
 *
 *   - Absolutely positioned ones. That is every band photograph and every
 *     scrim, including the hero's — which is the LCP element on the page and
 *     must never start at zero opacity.
 *   - `aria-hidden` ones, which are decoration by their own admission.
 *   - Anything with neither text nor a picture in it — a spacer, a rule, an
 *     empty wrapper. Everything a visitor can actually read or look at is
 *     revealed; a block that carries only a photograph now arrives with the
 *     same fade the copy does, rather than being the one thing on the page
 *     that is simply there.
 *   - Anything marked `data-reveal="off"`, and its children. The How It Works
 *     deck is the one that asks: those cards already arrive by covering the one
 *     before them, which is the whole point of the section, and a fade on top of
 *     that was a second arrival for the same card.
 *
 * And nothing that is already on screen when you arrive is touched at all: its
 * position is measured once at setup, and a block inside the window keeps the
 * markup's own visible state. Hiding it would mean the server-rendered page
 * paints, then blanks, then fades back — a flash where there was none. What is
 * above the fold was never hidden; the animation is for what you scroll to.
 *
 * Sticky blocks fade without the rise. The How It Works deck sticks its cards,
 * and a sticky element under a `y` transform fights its own offset.
 *
 * Under `prefers-reduced-motion` the effect does not run: nothing is hidden and
 * no trigger is created. The same is true with JavaScript off — the hidden
 * state is set from here, never in the markup, so a page that never runs this
 * is a page that reads normally.
 */

/** How far below the window's own bottom edge a block waits before it moves. */
const START = "top 88%";
const RISE = 24;

export function RevealGroup({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion) return;

    // A context so every tween, every `set` and every ScrollTrigger made in
    // here is reverted together — including the opacity, which `revert` puts
    // back rather than leaving a block invisible if this ever unmounts.
    const context = gsap.context(() => {
      const children = (Array.from(root.children) as HTMLElement[]).filter(
        (child) => child.dataset.reveal !== "off",
      );
      const blocks = children.flatMap((child) =>
        child.tagName === "OL" || child.tagName === "UL"
          ? (Array.from(child.children) as HTMLElement[])
          : [child],
      );

      for (const block of blocks) {
        const style = window.getComputedStyle(block);

        if (style.position === "absolute" || style.position === "fixed") continue;
        if (block.getAttribute("aria-hidden") === "true") continue;

        // Text or media. A block with neither is structure, and structure has
        // nothing to arrive.
        const hasText = Boolean(block.textContent?.trim());
        const hasMedia = block.querySelector("img, picture, svg, video, canvas") !== null;
        if (!hasText && !hasMedia) continue;
        if (block.getBoundingClientRect().top < window.innerHeight) continue;

        const sticky = style.position === "sticky";
        const from = sticky ? { opacity: 0 } : { opacity: 0, y: RISE };

        gsap.set(block, from);
        gsap.to(block, {
          opacity: 1,
          // Only what was offset comes back — a sticky card never gets a
          // transform of its own, not even a zeroed one.
          ...(sticky ? {} : { y: 0 }),
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: block,
            start: START,
            // Play in on the way down, and reverse — fade back out — on the way
            // up, so the page reads the same in both directions.
            toggleActions: "play none none reverse",
          },
        });
      }
    }, root);

    return () => context.revert();
  }, [prefersReducedMotion]);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
