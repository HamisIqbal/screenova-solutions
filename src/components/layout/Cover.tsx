"use client";

import { useRef, useState } from "react";
import { gsap } from "@/animations";
import { useIsomorphicLayoutEffect, usePrefersReducedMotion } from "@/hooks";

/**
 * Load cover. A window, closed across the whole screen, that swings open and
 * leaves the page behind it.
 *
 * The metaphor is the product: this is a company that puts screens in windows,
 * so the page opens the way one does. Two casement sashes meet at a centre
 * mullion; on load they swing inward — away from the viewer — around their
 * outer hinges until they are edge-on and gone.
 *
 * How the swing works: the container carries a `perspective`, and each sash is
 * rotated about the Y axis with its `transform-origin` pinned to its own outer
 * edge. Rotating the left sash positive and the right sash negative sends both
 * free (inner) edges away from the viewer, which is a window opening into a
 * room rather than out at the face of whoever is looking. `backface-visibility:
 * hidden` is what makes the finish clean: the sash simply ceases to exist the
 * instant it passes 90°, so there is no flat card lying edge-on at the end and
 * no back side to see.
 *
 * There is no wordmark on it. The cover is a beat, not a splash screen — the
 * name is in the header the moment the sashes clear, and putting it here only
 * asks the visitor to read something before they are allowed in.
 *
 * The sashes are drawn rather than pictured: a navy pane, a mesh at 4% white
 * standing in for the screen cloth, a frame line inset from the edge, and one
 * diagonal sheen so the pane reads as glass rather than as a coloured rectangle.
 * All of it is CSS, so the cover costs nothing to fetch and paints on the first
 * frame — including server-side, which is why nothing here waits on a measure.
 */

/** Beat before the sashes move, so the closed window registers as a window. */
const DWELL = 0.28;
/** How long the swing takes. */
const SWING = 1.05;
/** Past 90°, so the sash is unambiguously gone rather than a zero-width line. */
const SWING_ANGLE = 104;
/** The two sashes overlap the centre by a hair so no seam of page shows early. */
const OVERLAP = "calc(50% + 1px)";
/** If anything goes wrong, never leave the page covered. */
const SAFETY_MS = 5000;

/**
 * One sash. `side` is which edge it hinges on, and everything else about it —
 * width, origin, the shading that falls toward the hinge — follows from that.
 */
function Sash({ side, ref }: { side: "left" | "right"; ref: React.Ref<HTMLDivElement> }) {
  const isLeft = side === "left";

  return (
    <div
      ref={ref}
      className="absolute inset-y-0"
      style={{
        left: isLeft ? 0 : undefined,
        right: isLeft ? undefined : 0,
        width: OVERLAP,
        transformOrigin: isLeft ? "left center" : "right center",
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        willChange: "transform",
        // The pane. Navy, lit from the centre seam so the two sashes read as one
        // window rather than as two identical blocks.
        background: `linear-gradient(${isLeft ? "100deg" : "260deg"}, #04101d 0%, var(--color-navy) 55%, #0b2542 100%)`,
      }}
    >
      {/* The screen cloth: a mesh, at the opacity a real one reads at against a
          dark room — present, not decorative. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 4px)," +
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 4px)",
        }}
      />

      {/* The sheen. One diagonal band, angled the same way on both sashes so the
          light has a single source across the whole window. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(118deg, transparent 28%, rgba(255,255,255,0.07) 46%, rgba(255,255,255,0.02) 54%, transparent 68%)",
        }}
      />

      {/* The frame: the sash's own rail, inset from the glazed edge. Brighter on
          the inner (free) edge, which is the one that catches the light and the
          one the eye follows as it swings away. */}
      <div
        aria-hidden="true"
        className="absolute inset-[3.5vmin]"
        style={{ border: "1px solid rgba(255,255,255,0.14)" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 w-px"
        style={{
          left: isLeft ? undefined : 0,
          right: isLeft ? 0 : undefined,
          background: "rgba(255,255,255,0.22)",
        }}
      />
    </div>
  );
}

export function Cover() {
  const [done, setDone] = useState(false);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
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

    // Reduced motion gets the page, not a shut window it has to wait out.
    const left = leftRef.current;
    const right = rightRef.current;
    if (prefersReducedMotion || !left || !right) {
      finish();
      return;
    }

    const timeline = gsap.timeline({ delay: DWELL, onComplete: finish });

    timeline
      .to(left, { rotateY: SWING_ANGLE, duration: SWING, ease: "power2.inOut" }, 0)
      .to(right, { rotateY: -SWING_ANGLE, duration: SWING, ease: "power2.inOut" }, 0);

    const safety = window.setTimeout(finish, SAFETY_MS);

    return () => {
      window.clearTimeout(safety);
      timeline.kill();
      root.style.overflow = previousOverflow;
    };
  }, [prefersReducedMotion]);

  if (done) return null;

  return (
    <>
      {/* Without JS the sashes never swing, so the cover must not exist at all. */}
      <noscript>
        <style>{`[data-cover]{display:none !important}`}</style>
      </noscript>

      <div
        data-cover
        aria-hidden="true"
        className="fixed inset-0 z-[100] overflow-hidden"
        style={{
          // Deep enough that the swing reads as depth rather than as a fisheye,
          // but tied to the viewport so a phone gets the same shape as a desk.
          // The `vw` term is what keeps a phone honest: a fixed 1600px against a
          // 390px window is a three-point perspective, and the sashes swing into
          // a tunnel rather than into a room.
          perspective: "min(1600px, 300vw)",
          perspectiveOrigin: "50% 50%",
        }}
      >
        <Sash side="left" ref={leftRef} />
        <Sash side="right" ref={rightRef} />
      </div>
    </>
  );
}
