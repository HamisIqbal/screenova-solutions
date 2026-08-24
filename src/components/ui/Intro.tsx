"use client";

import { gsap } from "@/animations";
import { useIsomorphicLayoutEffect, usePrefersReducedMotion } from "@/hooks";

/**
 * The page's entrance — the one animation that runs on arrival rather than on
 * scroll.
 *
 * `RevealGroup` handles everything you scroll to, and it deliberately leaves
 * the first screen alone: hiding what the server already painted would mean a
 * flash. That left the top of the page as the only part of the site that simply
 * appeared. This is that part. Between them the whole page arrives rather than
 * being there — the first screen from here, everything below it from
 * `RevealGroup`, and nothing owned by both.
 *
 * ---------------------------------------------------------------------------
 * The shape of it.
 *
 *   0.00 – 0.45s   the hero photograph and nothing else. The band, the picture
 *                  and its scrim are already painted; the words and the header
 *                  are not there yet. This is the beat the page opens on, and
 *                  it is what makes the type read as arriving rather than as
 *                  having been late.
 *   0.45s          the header and the headline start together, on the same
 *                  frame. Everything after them is offset from that instant by
 *                  its own `data-intro-at`, so the order is authored where the
 *                  markup is rather than inferred from DOM position here.
 *   ~1.35s         the last button has landed and the timeline is over.
 *
 * Only `opacity` and `transform` are animated, so nothing reflows, no element
 * moves another one, and the whole entrance runs on the compositor. Nothing in
 * it changes layout, which is also why it cannot shift the page while it plays.
 *
 * ---------------------------------------------------------------------------
 * Why the hiding is done in CSS and not here.
 *
 * The markup is server-rendered, so the browser paints the header and the hero
 * copy before a line of this file has run. Setting `opacity: 0` from a layout
 * effect would therefore be a visible blink — paint, blank, fade in. So the
 * hiding is a stylesheet rule (`globals.css`) armed by a one-line script at the
 * top of `<body>`, which runs before the header or the hero has been parsed.
 *
 * That script is also what makes the whole thing fail safe. It only arms when
 * scripting is on, it does not arm under `prefers-reduced-motion`, and it
 * disarms itself on a timer — so a page where this component never runs, never
 * hydrates, or throws is a page whose first screen is simply visible.
 *
 * On the way out the attribute is removed *before* the inline styles are
 * cleared, in that order and in the same frame: clearing first would leave the
 * rule holding the element at zero for a frame. `clearProps` matters more than
 * it looks — a lingering `transform` on the header would make it the containing
 * block for its own fixed-position menu overlay, so the transform is taken back
 * off rather than left at its resting value.
 */

/** How long the hero is left as picture alone, in seconds. */
const HOLD = 0.45;
/** How far an element rises into place when it does not say otherwise, in px. */
const RISE = 18;
const DURATION = 0.75;

export function Intro() {
  const prefersReducedMotion = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement;

    // Reduced motion never arms, and an unarmed page is already visible — so
    // there is nothing to animate and nothing to undo.
    if (prefersReducedMotion || !root.hasAttribute("data-intro-armed")) return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-intro]"));
    if (targets.length === 0) {
      root.removeAttribute("data-intro-armed");
      return;
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        delay: HOLD,
        onComplete: () => {
          root.removeAttribute("data-intro-armed");
          gsap.set(targets, { clearProps: "opacity,transform" });
        },
      });

      for (const target of targets) {
        // Both are authored on the element: `at` is when it starts, measured
        // from the moment the entrance proper begins, and `y` is where it comes
        // from — negative for the header, which belongs above the page rather
        // than below it.
        const at = Number(target.dataset.introAt ?? 0) || 0;
        const y = target.dataset.introY === undefined ? RISE : Number(target.dataset.introY);

        timeline.fromTo(
          target,
          { opacity: 0, y },
          { opacity: 1, y: 0, duration: DURATION, ease: "power3.out" },
          at,
        );
      }
    });

    return () => {
      context.revert();
      root.removeAttribute("data-intro-armed");
    };
  }, [prefersReducedMotion]);

  return null;
}

/**
 * The script that arms the entrance, run as the first thing in `<body>`.
 *
 * It is inline and synchronous on purpose: it has to have set the attribute
 * before the browser parses the header, or the hiding rule arrives too late to
 * hide anything. Everything about it is defensive — it is wrapped in a
 * `try`, it checks reduced motion itself, and it takes the attribute back off
 * after three seconds in case the React side never gets there.
 */
export const introArmingScript = `(function(){try{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;var r=document.documentElement;r.setAttribute('data-intro-armed','');window.setTimeout(function(){r.removeAttribute('data-intro-armed')},3000)}catch(e){}})();`;
