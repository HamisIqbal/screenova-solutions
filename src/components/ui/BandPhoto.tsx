import Image from "next/image";

/**
 * A photograph used as the floor of a section, with the scrim that makes type
 * legible on it.
 *
 * Three bands use it, and the hero — which came first and has its own
 * two-layer, measured scrim because its copy is centred in a column — does not.
 * If a fourth band ever wants the hero's treatment, that is the thing to lift
 * in here; until then this stays the simple case: full-bleed picture, one flat
 * scrim, content on top.
 *
 * Drop it in as the first child of a `Section` whose `bandClassName` carries
 * `relative overflow-clip`, and wrap that section's own content in a `relative`
 * element so it paints above. `fill` resolves against the section rather than
 * against the measure container, which is what lets the picture reach the
 * window edges while the copy stays in the column.
 *
 * ---------------------------------------------------------------------------
 * The scrim is 68% black, flat, and that number is measured rather than
 * eyeballed. All three photographs are bright exteriors with large blown-out
 * areas — white siding, open sky — so the worst pixel any text has to sit on is
 * pure white. At 68% that pixel resolves to sRGB 0.32, which leaves the `sky`
 * ground's white type at 7.9:1. Every role on this ground is that same white,
 * so there is no second case to check.
 *
 * Flat rather than a gradient because the content on these bands runs the full
 * measure, top to bottom — a gradient scrim is for copy that sits in one part
 * of the frame, and here there is no part of the frame that is safe to lighten.
 *
 * The band's ground colour still shows through while the picture loads, which
 * is the other half of why these sections are `sky`: black under a photograph
 * that has not arrived yet is a dark band, not a flash of white.
 *
 * ---------------------------------------------------------------------------
 * `sizes` is in pixels rather than the `100vw` a full-bleed picture normally
 * takes, and that is the one non-obvious thing in this file.
 *
 * `sizes` tells the browser how *wide* to fetch, but a covering background is
 * bound by whichever axis crops harder, and on these bands that is the height.
 * A phone is the extreme case: the Why Choose Us band is 375px wide and 1432px
 * tall, so covering it with a 4845x2710 photograph scales that photograph to
 * 2559px wide and throws away five sixths of it. `100vw` would ask for the
 * 640px candidate and stretch it four times over — visibly soft even under a
 * scrim. Stating the width outright asks for a candidate that survives the
 * crop.
 *
 * The three numbers are the widest of the three bands at each breakpoint,
 * rounded to a candidate `next/image` actually generates. They overshoot on the
 * shorter bands, which is the right way round: a picture that is slightly
 * larger than it needs to be costs bytes, and one that is smaller costs the
 * only thing this element is for.
 */
export function BandPhoto({ src, width, height }: { src: string; width: number; height: number }) {
  return (
    <>
      <Image
        src={src}
        width={width}
        height={height}
        // Empty: these are grounds, and the heading painted on top of each one
        // already says what the band is. See `bandImages` in `content/home.ts`.
        alt=""
        sizes="(max-width: 40rem) 1200px, (max-width: 64rem) 1920px, 1920px"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div aria-hidden="true" className="absolute inset-0 bg-black/68" />
    </>
  );
}
