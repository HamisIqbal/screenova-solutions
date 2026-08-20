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
 *   lg and up — 55% flat, plus a centred ellipse over it. Behind the words
 *     those multiply out to 1 - (0.45 x 0.55) = 75.25%, and by the edges of the
 *     frame it has fallen back to about 57% and the windows are still windows.
 *
 * The second layer used to be a left-weighted linear gradient, because the copy
 * used to be ranged left in a 62% column. The copy is centred now, so a scrim
 * weighted to one side would have left the right half of every centred line
 * sitting on the thinner end of it. Weighting follows the words: the words
 * moved to the middle, so the weight did too.
 *
 * ---------------------------------------------------------------------------
 * The band declares `data-ground="sky"` — the black chrome ground — so the copy
 * takes a dark ground's roles rather than being hand-painted white: the heading
 * resolves `--hero-ink` to `blue-soft`, body and muted body both go white, and
 * the button inverts to white carrying black. That last one is why the black
 * override this section used to carry is gone: on a dark photograph a black
 * pill is a hole, and the ground already knew what to do.
 *
 * ---------------------------------------------------------------------------
 * The copy is centred, and stacked with air between its three parts.
 *
 * It sits in a centred column rather than a left rail, which is the one change
 * that has to be checked against the type rather than eyeballed: the headline's
 * break was cut to fit a measured width. The binding line is 13.03em, which at
 * the 44px ceiling is 573px — comfortably inside the 768px column it is centred
 * in, so the authored two-line break survives. See `content/home.ts`.
 *
 * The paragraphs keep their 27em measure, which is what holds them to three
 * lines each at every viewport; they are only centred within it, not widened.
 *
 * The block also rides higher in the band than dead centre. The band centres
 * its content, and extra padding at the foot is what lifts it — the copy reads
 * better sitting above the middle of a photograph than straddling it, and the
 * room it gives up is at the bottom of the frame where the floor is.
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

      {/* Scrim, part two: the extra weight behind the words, desktop only, and
          centred because the words are. Over the copy the two layers multiply
          to 75.25%, which holds `blue-soft` at 4.6:1 even where the pixel
          behind it is a blown-out window; by the edges of the frame it has
          eased back to about 57% and the photograph is still readable. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.38)_45%,rgba(0,0,0,0.05)_100%)] lg:block"
      />

      {/* Centred on the band and held to a measure the authored line break
          survives. `pb` is what lifts the block above dead centre — the band
          centres what is in it, so padding at the foot is the lever. */}
      <div className="relative mx-auto max-w-3xl pb-10 text-center lg:pb-16">
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

        {/* Three steps of air, widening as they go down: the headline is set
            off from the copy, the copy holds together as one voice, and the
            button is set off from both. `mx-auto` on the paragraphs centres
            them inside the 27em measure `globals.css` gives them — a measure
            is a reading width, not a length limit, so it is centred, never
            widened. The first paragraph runs long enough to set the band's
            height on a phone; if that ever needs reining in, the fix is fewer
            words, not a wider column. */}
        <div className="mt-9 flex flex-col items-center gap-4 lg:mt-11">
          <p className="mx-auto">{hero.subtitle}</p>
          <p className="mx-auto text-(--on-ground-muted)">{hero.body}</p>

          <CtaLink href="#quote" className="mt-8 lg:mt-10">
            {hero.cta}
          </CtaLink>
        </div>
      </div>
    </Section>
  );
}
