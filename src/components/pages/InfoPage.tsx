import Link from "next/link";
import { CtaLink, Section, SectionHeader } from "@/components/ui";
import { TrustBar } from "@/components/sections";
import type { CityPageContent, InfoPageContent } from "@/content/pages";
import { isServedZip } from "@/lib/serviceArea";
import { contact } from "@/lib/site";

/**
 * The body of every page that is not the home page: four service pages and four
 * city pages, all of them rendered by this one component.
 *
 * One component and one set of bands, but the words are written per page in
 * `src/content/pages.ts` — which is the only thing separating a small set of
 * useful pages from a doorway network. If a future page's content is this
 * component plus a swapped noun, it should not be published.
 *
 * ---------------------------------------------------------------------------
 * The bands, in order, and why each is here.
 *
 *   hero      the page's one H1, a supporting paragraph, and the same two
 *             actions the home page leads with. Navy rather than a photograph:
 *             these pages have no picture of their own, and a band that is
 *             honestly a colour reads better than one borrowing the home page's
 *             hero shot for a subject it is not about.
 *   TrustBar  the same strip, reused rather than re-made — the six marks are
 *             true on every page and there is no reason for a second copy.
 *   blocks    the actual content, on paper, at a reading measure.
 *   ZIPs      city pages only. Read off the same table the quote form checks
 *             against, and filtered through `isServedZip` so the page can never
 *             advertise a ZIP the form would turn away.
 *   related   internal links out, every one to a route that exists.
 *   closer    the ask.
 *
 * The whole page hands off to the home page's quote form rather than carrying a
 * second copy of it. One form, one submit path, one place where ZIP validation
 * and photo upload live — `/#quote` from anywhere.
 */
export function InfoPage({ content }: { content: InfoPageContent | CityPageContent }) {
  // `zips` only exists on a city page. Narrowing on the property rather than on
  // a discriminant keeps `pages.ts` free of a tag that exists only for this.
  const zips = "zips" in content ? content.zips.filter(isServedZip) : [];
  const city = "city" in content ? content.city : null;

  return (
    <>
      <Section
        id="page-hero"
        ground="sky"
        labelledBy="page-title"
        // The band's own floor, over the chrome ground's black — the same navy
        // Screen Options uses. Utilities sort after the base layer, so this
        // wins without an `!important`.
        bandClassName="bg-navy"
        className="flex min-h-[18rem] flex-col justify-center lg:min-h-[22rem]"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h1 id="page-title">{content.title}</h1>

          <p className="mx-auto mt-6 lg:mt-8">{content.supporting}</p>

          <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
            <CtaLink href="/#quote" className="justify-center">
              Get a Free Quote
            </CtaLink>
            <CtaLink
              href={contact.phone.href}
              variant="outline"
              className="justify-center"
              ariaLabel={`Call Screenova on ${contact.phone.label}`}
            >
              Call Now
            </CtaLink>
          </div>
        </div>
      </Section>

      <TrustBar />

      <Section id="detail" ground="paper" labelledBy="detail-title">
        {/* The page's opening paragraphs stand as the section header, so the
            first thing under the hero is prose rather than a second title bar.
            The heading itself is the first block's — see below — so this header
            carries an `sr-only` name for the region and nothing visible. */}
        <h2 id="detail-title" className="sr-only">
          {content.title}
        </h2>

        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {content.intro.map((paragraph) => (
            <p key={paragraph} className="mx-auto text-(--on-ground-muted)">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mx-auto mt-[clamp(2.5rem,6vw,4.5rem)] flex max-w-2xl flex-col gap-[clamp(2.5rem,6vw,4rem)]">
          {content.blocks.map((block) => (
            <article key={block.title}>
              <h3 className="font-bold">{block.title}</h3>

              <div className="mt-4 flex flex-col gap-3 text-(--on-ground-muted)">
                {block.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              {block.list && (
                <ul className="mt-4 flex flex-col gap-2">
                  {block.list.map((entry) => (
                    <li key={entry} className="flex gap-3 text-(--on-ground-muted)">
                      {/* A rule rather than a bullet: `main ul` has no list
                          style by design, and a drawn dash keeps the list
                          reading as the page's own furniture. */}
                      <span aria-hidden="true" className="mt-3 h-px w-3 shrink-0 bg-(--rule)" />
                      <span>{entry}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </Section>

      {city && zips.length > 0 && (
        <Section id="zips" ground="blue" labelledBy="zips-title">
          <SectionHeader
            title={`ZIP Codes We Cover in ${city}`}
            titleId="zips-title"
            intro="Not on the list? Call us — the edge of a service area is a judgement call, not a table."
          />

          <ul className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2">
            {zips.map((zip) => (
              <li
                key={zip}
                className="font-title rounded-full border border-(--on-ground)/40 px-3 py-1 tabular-nums"
                style={{ fontSize: "var(--text-label)" }}
              >
                {zip}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex justify-center">
            <CtaLink href="/#quote">Check Your ZIP Code</CtaLink>
          </div>
        </Section>
      )}

      <Section id="related" ground="paper" labelledBy="related-title">
        <SectionHeader title={content.relatedLabel} titleId="related-title" />

        <ul className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
          {content.related.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-2xl border border-(--raised-border) px-5 py-4 no-underline transition-colors hover:bg-(--raised)"
              >
                <span className="font-title font-medium">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="closer" ground="blue" labelledBy="closer-title">
        <div className="text-center">
          <h2 id="closer-title" className="mx-auto max-w-2xl">
            {city
              ? `Screens to fix or replace in ${city}?`
              : "Send us a photo and we'll tell you what it needs."}
          </h2>

          <p className="mx-auto mt-5">
            Free estimates across Tampa Bay, and no charge for the drive.
          </p>

          <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
            <CtaLink href="/#quote" className="justify-center">
              Send Us a Photo
            </CtaLink>
            <CtaLink
              href={contact.phone.href}
              variant="outline"
              className="justify-center"
              ariaLabel={`Call Screenova on ${contact.phone.label}`}
            >
              Call {contact.phone.label}
            </CtaLink>
          </div>
        </div>
      </Section>
    </>
  );
}
