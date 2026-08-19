import { BandPhoto, CtaLink, Section } from "@/components/ui";
import { bandImages, finalCta } from "@/content/home";
import { contact } from "@/lib/site";

/**
 * The closer, on a photograph. The band was paper and is now `sky`, because its
 * floor is a picture and a photograph needs the text roles a dark ground
 * provides.
 *
 * That costs this section the one thing it used to be built around: on white
 * the action pill was green at full strength, and green is 2.59:1 against a
 * dark ground, so on the chrome ground the pill goes white carrying black. It
 * is the same trade the hero makes, and the two photographic bands now bracket
 * the page with the same button. Green is still the page's "go" — it is on
 * every pill that sits on a white band — it just is not the last word any more.
 * Say so if that was the point, and the ask can go back on paper.
 *
 * The picture is a gable and a window against open sky: the most upward of the
 * three photographs, which is the right note to end on.
 *
 * `finalCta.eyebrow` is deliberately not rendered — "Final Call to Action" is
 * a label from the content brief describing the block, not copy for the page.
 *
 * ---------------------------------------------------------------------------
 * Two things to click, not one and a sentence. "Call Screenova Solutions" used
 * to be a line of text sitting next to the quote button — the second most
 * useful action on the page, set as though it were a caption. It is a `tel:`
 * link on the pill now, so a thumb on a phone dials and a desktop hands it to
 * whatever takes calls there. It is the drawn variant rather than a second
 * filled one: the form is still the ask, and calling is the alternative.
 *
 * The band is also the tallest on the page, and deliberately. It is the last
 * thing before the footer, and the room under the buttons is what stops the
 * page ending the moment it has finished asking.
 *
 * That room ends in the tagline, which is no longer a 12px label at the foot of
 * the block but the largest type on the site: right aligned, hard against the
 * end of the measure, in the hero's own Black face. It works as the page's last
 * word because it says the one thing a local trade has to say — where it works —
 * and because a line that big reads as a sign rather than as a sentence, which
 * is what a closing line should be. Right aligned specifically: everything above
 * it starts at the left margin, so ending on the opposite edge is what makes it
 * land as a full stop instead of one more line of copy.
 *
 * The trailing dots are drawn in the markup rather than typed into the content:
 * they are a lead-out, not words, so they are `aria-hidden` and a screen reader
 * is handed the tagline and nothing else.
 */
export function FinalCta() {
  return (
    <Section
      id="contact"
      ground="sky"
      labelledBy="contact-title"
      // `clip` rather than `hidden`: it holds the cropped edges of the
      // photograph without making a scroll container.
      bandClassName="relative overflow-clip"
      // The tallest band on the page. The closer is the last thing before the
      // footer and it is given room to be one — see the note above.
      className="pb-[clamp(2rem,6vw,5rem)] lg:min-h-[80vh]"
    >
      <BandPhoto {...bandImages.finalCta} />

      {/* `relative`, so the content paints above the picture and its scrim —
          both are positioned, and a static sibling would sit under them. */}
      <div className="relative">
        {/* No override any more: every h2 on the page is a describing sentence
            again, so the rule in `globals.css` is already the right one. */}
        <h2 id="contact-title" className="max-w-2xl">
          {finalCta.title}
        </h2>

        <div className="mt-5 flex max-w-xl flex-col gap-3 text-(--on-ground-muted)">
          {finalCta.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-4">
          <CtaLink href="#quote">{finalCta.primaryCta}</CtaLink>

          {/* The number is in the accessible name as well as the href, so the
              link announces what it will dial rather than only "call us". */}
          <CtaLink
            href={contact.phone.href}
            variant="outline"
            ariaLabel={`${finalCta.secondaryCta} on ${contact.phone.label}`}
          >
            {finalCta.secondaryCta}
          </CtaLink>
        </div>

        {/* The closing line. `max-w-none` because the global `p` measure is 62ch
            and this is a sign, not a paragraph — and `mt` in `vw` so the room
            above it opens with the type rather than staying a fixed gap under a
            line that has trebled in size. It stays in the ground's own ink:
            sunset would not read on a darkened photograph, and the two sparks
            the page is allowed are already spent on the "Best for" chip and the
            FAQ marker. */}
        <p
          className="font-hero mt-[clamp(4rem,14vw,10rem)] max-w-none text-right"
          style={{
            fontSize: "clamp(2.25rem, 11vw, 8rem)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
          }}
        >
          {finalCta.tagline.toUpperCase()}
          <span aria-hidden="true">.......</span>
        </p>
      </div>
    </Section>
  );
}
