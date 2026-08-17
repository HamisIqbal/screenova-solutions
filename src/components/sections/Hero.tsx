import Image from "next/image";
import { CtaLink, Section } from "@/components/ui";
import { hero, heroImage } from "@/content/home";

/**
 * Hero. The photograph is the floor now, not an object beside the words: it
 * fills the band edge to edge and the copy stands on it.
 *
 * Three layers, in paint order — picture, scrim, words. The picture and the
 * scrims are absolutely positioned children of the measure container, which is
 * itself unpositioned, so `inset-0` resolves against the *band* and they reach
 * the window on both sides while the words stay inside the measure. The words
 * carry `relative` and come last in the DOM, which is all they need to sit on
 * top — positioned elements paint above the flow regardless of z-index.
 *
 * ---------------------------------------------------------------------------
 * The scrim, which is the whole problem.
 *
 * The room is bright and every window in it is blown out — the source's
 * highlights sit around sRGB 0.95, which is effectively white. Type cannot go
 * on that untreated, and a scrim that merely "looks dark enough" is a guess. So
 * it is solved instead, compositing in sRGB and converting to relative
 * luminance to read the contrast off:
 *
 *   scrim   worst-case pixel behind the type   white on it   blue-soft on it
 *   45%            sRGB 0.95 -> L 0.235            3.7:1          1.4:1
 *   55%            sRGB 0.95 -> L 0.153            5.2:1          2.4:1
 *   70%            sRGB 0.95 -> L 0.066            9.1:1          4.2:1
 *
 * 70% is the number that carries the headline, because `blue-soft` is the
 * binding case rather than the white body copy — a light blue has much less
 * room over a dark ground than white does. Over the more typical wall behind
 * the text (sRGB 0.72) the same 70% gives blue-soft 5.6:1 and white 12:1.
 *
 * It arrives as two layers rather than one flat 70%, because a flat 70%
 * everywhere would leave nothing of the photograph worth showing:
 *
 *   below lg — one uniform 70%. The words run the full width here, so there is
 *     no side of the frame that can be left alone.
 *   lg and up — 55% flat, plus a left-weighted gradient over it. Where the
 *     words are those multiply out to 1 - (0.45 x 0.65) = 70.75%, and by the
 *     right edge it has fallen back to 55% and the windows are still windows.
 *
 * ---------------------------------------------------------------------------
 * The band declares `data-ground="sky"` — the black chrome ground — so the copy
 * takes a dark ground's roles rather than being hand-painted white: the heading
 * resolves `--hero-ink` to `blue-soft`, body and muted body both go white, and
 * the button inverts to white carrying black. That last one is why the black
 * override this section used to carry is gone: on a dark photograph a black
 * pill is a hole, and the ground already knew what to do.
 *
 * The words stay in a 46% column past lg. They no longer have to share the band
 * with anything, but the headline's four-line break was cut against exactly
 * that width — see `content/home.ts` — and it is also the width the gradient is
 * weighted for.
 */
export function Hero() {
  return (
    <Section
      id="hero"
      ground="sky"
      labelledBy="hero-title"
      // `clip` rather than `hidden`: it holds the cropped edges of the
      // photograph without making a scroll container.
      bandClassName="relative overflow-clip"
      className="flex min-h-[28rem] flex-col justify-center lg:min-h-[34rem]"
    >
      {/* The LCP element on the page, so it loads eagerly and declares its box.
          `object-center` keeps the wall of windows — the reason this photograph
          is here — in frame at every crop. */}
      <Image
        src={heroImage.src}
        width={heroImage.width}
        height={heroImage.height}
        alt={heroImage.alt}
        priority
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Scrim, part one: the floor under every reading. */}
      <div aria-hidden="true" className="absolute inset-0 bg-black/70 lg:bg-black/55" />

      {/* Scrim, part two: the extra weight behind the words, desktop only.
          It carries further right than it used to — the headline now runs to
          about half the window rather than a third, and the gradient has to
          stay under all of it. At the headline's right edge the two layers
          multiply to 68.5%, which holds `blue-soft` at 4.0:1 even where the
          pixel behind it is a blown-out window. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden bg-gradient-to-r from-black/45 via-black/30 to-black/5 lg:block"
      />

      <div className="relative lg:w-[62%]">
        <h1 id="hero-title">
          {/* One block per line: the break is authored, not left to the
              browser, and each line is its own element for later staggered
              animation. Two lines, and the widths they were cut to are
              recorded next to the copy in `content/home.ts`. */}
          {hero.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <div className="mt-5 flex flex-col items-start gap-2">
          <p>{hero.subtitle}</p>
          <p className="text-(--on-ground-muted)">{hero.body}</p>

          <CtaLink href="#quote" className="mt-6">
            {hero.cta}
          </CtaLink>
        </div>
      </div>
    </Section>
  );
}
