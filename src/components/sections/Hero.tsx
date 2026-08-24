import Image from "next/image";
import { CtaLink, Section } from "@/components/ui";
import { hero, heroImage } from "@/content/home";
import { contact } from "@/lib/site";

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
 *   75%            sRGB 0.95 -> L 0.050            11.6:1         4.9:1
 *
 * 75% is the number that carries the band, because `blue-soft` is the binding
 * case rather than the white headline — a light blue has much less room over a
 * dark ground than white does, and the light blue is now what the two
 * supporting paragraphs are set in. 70% left them at 4.2:1 against a blown-out
 * window, under the 4.5:1 body-text floor; 75% clears it. Over the more typical
 * wall behind the text (sRGB 0.72) the same 75% gives blue-soft 6.4:1 and the
 * white headline 14:1.
 *
 * It arrives as two layers rather than one flat 75%, because a flat 75%
 * everywhere would leave nothing of the photograph worth showing:
 *
 *   below lg — one uniform 75%. The words run the full width here, so there is
 *     no side of the frame that can be left alone.
 *   lg and up — 55% flat, plus a centred ellipse over it. Behind the words
 *     those multiply out to 1 - (0.45 x 0.55) = 75.25%, and by the edges of the
 *     frame it has fallen back to about 57% and the windows are still windows.
 *
 * ---------------------------------------------------------------------------
 * The band declares `data-ground="sky"` — the black chrome ground — so the
 * furniture takes a dark ground's roles: the button inverts to white carrying
 * black. The type is the one place this band overrides the ground, and it
 * overrides it by swapping the two roles the ground would hand out. The
 * heading is white rather than the ground's `--hero-ink` blue, and both
 * supporting paragraphs are `blue-soft` rather than white. Colour then carries
 * the same split the sizes already do — one white headline, one blue block of
 * support beneath it — instead of tinting the loudest element and leaving the
 * two paragraphs to be told apart by weight alone.
 *
 * ---------------------------------------------------------------------------
 * What the hero says, in order, and why it is exactly this much.
 *
 *   h1            the page's one H1, two authored lines
 *   supporting    "We come to you…" — a paragraph, not a second heading
 *   body          the problems people actually arrive with
 *   two buttons   the form, and the telephone
 *
 * And nothing else. The requirement that both buttons are on screen without
 * scrolling is what sets the budget: on a 390x780 phone the band spends about
 * 120px on header clearance before it starts, and everything above the buttons
 * has to fit in what is left. That is why the trust marks are *not* in here —
 * they are their own thin strip immediately below the band (`TrustBar`), which
 * is still the top of the page but is no longer competing with the buttons for
 * the first screen. It is also why the two paragraphs are short and the
 * vertical rhythm steps up rather than starting wide.
 *
 * The headline's lines are authored, and each is rendered as its own block with
 * a trailing space. The space is not decoration: without it the two blocks
 * concatenate to "…Screens &Screen Repair…" for anything reading the text
 * rather than the layout — a screen reader, a search engine, a copy-paste — and
 * the headline is wrong everywhere it is not being looked at.
 *
 * The two buttons sit side by side on a desktop and stack on a phone, which is
 * `flex-col sm:flex-row`. "Call Now" is the drawn variant rather than a second
 * filled pill: the form is still the ask, and two equal fills would make the
 * visitor choose between two identical objects. Its href is the `tel:` form
 * from `src/lib/site.ts` — the same number the header, the footer, the form and
 * the closer all carry — so a thumb dials it and a desktop hands it off.
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
      className="flex min-h-[26rem] flex-col justify-center lg:min-h-[34rem]"
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
      <div aria-hidden="true" className="absolute inset-0 bg-black/75 lg:bg-black/55" />

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
      <div className="relative mx-auto max-w-3xl pb-6 text-center lg:pb-14">
        {/* White, not the ground's `--hero-ink` blue. The headline is the
            heaviest thing in the band and white on the scrimmed photograph is
            the strongest contrast the site has (12:1 over the typical wall,
            9:1 over a blown-out window); the light blue is spent below instead,
            where it now marks the two supporting paragraphs as one group. */}
        <h1 id="hero-title" className="text-(--color-paper)">
          {/* One block per line: the break is authored, not left to the
              browser, and each line is its own element for later staggered
              animation. The trailing space on all but the last is what keeps
              the *text* of the headline correct — see the note above. Two
              lines, and the widths they were cut to are recorded next to the
              copy in `content/home.ts`. */}
          {hero.titleLines.map((line, i) => (
            <span key={line} className="block">
              {line}
              {i < hero.titleLines.length - 1 ? " " : ""}
            </span>
          ))}
        </h1>

        <div className="mt-6 flex flex-col items-center gap-3 lg:mt-9 lg:gap-4">
          {/* The supporting line. A paragraph and not a heading — the page has
              one H1 and this is not it — but set at the lead size and in the
              ground's full ink, which is what makes it read as the second
              thing you take in rather than as body copy. */}
          {/* Both supporting paragraphs in `blue-soft`, the palette's light
              blue. It is the binding contrast case on this band — a light blue
              has far less room over a dark ground than white does — which is
              what sets the mobile scrim at 75% above: worst-case that holds
              blue-soft at 4.9:1 over even a blown-out window, and desktop's
              two layers multiply to the same place. */}
          <p className="mx-auto font-medium text-(--color-blue-soft)">{hero.supporting}</p>
          <p className="mx-auto text-(--color-blue-soft)">{hero.body}</p>
        </div>

        {/* Both actions, and both on the first screen. Stacked on a phone in
            the order they are ranked; side by side from `sm`. */}
        <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4 lg:mt-9">
          <CtaLink href="#quote" className="justify-center">
            {hero.cta}
          </CtaLink>

          {/* The number is in the accessible name as well as the href, so the
              link announces what it will dial rather than only "call now". */}
          <CtaLink
            href={contact.phone.href}
            variant="outline"
            className="justify-center"
            ariaLabel={`${hero.callCta} — call Screenova on ${contact.phone.label}`}
          >
            {hero.callCta}
          </CtaLink>
        </div>
      </div>
    </Section>
  );
}
