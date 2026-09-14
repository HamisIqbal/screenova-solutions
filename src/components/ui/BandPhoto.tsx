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
 *
 * ---------------------------------------------------------------------------
 * `pinned` is for a band much taller than the window — Screen Options, whose
 * options arrive one at a time down a long column. Covering the whole band
 * with a landscape photograph would scale it to the band's height and crop it
 * to a sliver on a phone. Pinned, the picture instead covers a frame the size
 * of the window that sticks to it while the band scrolls past, so it is only
 * ever cropped to the shape of the screen — and `sizes` can say exactly how
 * wide that is. The frame is capped at the band's own height, so on a band
 * shorter than the window nothing overhangs it.
 *
 * It sits on a track that fills the band, because `sticky` holds an element
 * inside its parent: the track is what gives the frame the band's length to
 * travel. `overflow-clip` on the band — rather than `hidden` — is what lets it
 * stick at all, since a clip does not make a scroll container. A pinned photo
 * goes in the `Section`'s `floor` prop rather than among its children, so the
 * track fills the band and not the text column.
 *
 * `alternate` is a second photograph for a pinned frame, and the two take
 * turns: the second fades in over the first, holds, and fades back out — see
 * `band-alternate` in `globals.css`. Under `prefers-reduced-motion` the fade
 * never runs and the first photograph is simply the floor.
 */
type Photo = { src: string; width: number; height: number };

export function BandPhoto({
  src,
  width,
  height,
  pinned = false,
  alternate,
}: Photo & {
  pinned?: boolean;
  alternate?: Photo;
}) {
  if (pinned) {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="sticky top-0 h-svh max-h-full overflow-hidden">
          <FramePhoto src={src} width={width} height={height} />
          {alternate && <FramePhoto {...alternate} className="band-alternate" />}
          <div className="absolute inset-0 bg-black/68" />
        </div>
      </div>
    );
  }

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

/** One photograph covering a pinned, window-sized frame. */
function FramePhoto({ src, width, height, className = "" }: Photo & { className?: string }) {
  // The frame covers the window, so the picture is as wide as the window — or,
  // on a window narrower than the photograph's shape, as wide as the window's
  // height stretched to that shape.
  const ratio = Math.ceil((width / height) * 100);

  return (
    <Image
      src={src}
      alt=""
      fill
      sizes={`(max-aspect-ratio: ${width}/${height}) ${ratio}vh, 100vw`}
      className={`object-cover object-center ${className}`}
    />
  );
}
