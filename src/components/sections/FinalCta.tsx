import { BandPhoto, CtaLink, Section } from "@/components/ui";
import { bandImages, finalCta } from "@/content/home";

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

        <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
          <CtaLink href="#quote">{finalCta.primaryCta}</CtaLink>
          <span className="font-title" style={{ fontWeight: 400 }}>
            {finalCta.secondaryCta}
          </span>
        </div>

        {/* The tagline stays in the ground's own ink. Sunset would not read on a
            darkened photograph — it is a fill on white and nowhere else — and
            the two sparks the page is allowed are already spent on the "Best
            for" chip and the FAQ marker. */}
        <p
          className="font-title mt-10"
          style={{ fontSize: "var(--text-label)", letterSpacing: "0.16em", fontWeight: 400 }}
        >
          {finalCta.tagline.toUpperCase()}
        </p>
      </div>
    </Section>
  );
}
