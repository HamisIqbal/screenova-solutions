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
 * The whole band is centred — heading, copy, both buttons and the tagline under
 * them — and sits a little lower in the room the height gives it, so the block
 * reads as one closing statement on the middle of the picture rather than as a
 * left rail with space beside it.
 *
 * That room ends in the tagline, which is set larger than the label it used to
 * be but well under the heading: it is the page's last word, not its loudest.
 * In the hero's Black face, so it lands as a sign rather than as one more line
 * of copy, and nothing follows it.
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
          both are positioned, and a static sibling would sit under them. `pt`
          is what sits the block lower in the band: the section is tall now, and
          the content reads better below the middle of the picture than at the
          top of it. */}
      <div className="relative pt-[clamp(2rem,8vw,7rem)] text-center">
        {/* No override any more: every h2 on the page is a describing sentence
            again, so the rule in `globals.css` is already the right one. */}
        <h2 id="contact-title" className="mx-auto max-w-2xl">
          {finalCta.title}
        </h2>

        <div className="mx-auto mt-5 flex max-w-xl flex-col items-center gap-3 text-(--on-ground-muted)">
          {finalCta.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-4 gap-y-4">
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
            above it opens with the type rather than staying a fixed gap. It
            stays in the ground's own ink: sunset would not read on a darkened
            photograph, and the two sparks the page is allowed are already spent
            on the "Best for" chip and the FAQ marker. */}
        <p
          className="font-hero mt-[clamp(3rem,10vw,7rem)] max-w-none"
          style={{
            fontSize: "clamp(1.25rem, 3.2vw, 2.25rem)",
            fontWeight: 900,
            letterSpacing: "-0.01em",
            lineHeight: 1.1,
          }}
        >
          {finalCta.tagline.toUpperCase()}
        </p>
      </div>
    </Section>
  );
}
