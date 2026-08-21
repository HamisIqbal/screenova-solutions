import { Check } from "lucide-react";
import { Section } from "@/components/ui";
import { trustSignals } from "@/content/home";

/**
 * The strip directly under the hero: six things that are true about how the
 * service works.
 *
 * It is here rather than inside the hero for one reason — the hero has to get
 * both of its buttons onto the first screen of a phone, and six more lines
 * above the fold is exactly what stops that. Immediately below the band is
 * still the top of the page, and it is the first thing the reader meets after
 * the ask.
 *
 * Every mark is a service or value proposition and none of them is a rating, a
 * count, a badge or an award. Nothing here needs a source to stand up, which is
 * the test: "Free Estimates" is a policy, "Rated 5 Stars by 200 Customers" is a
 * claim, and only the first kind belongs on a page that has no reviews on it
 * yet. See `reviews` in `content/home.ts` for where the second kind will go
 * once it is real.
 *
 * The strip is deliberately not a band in the page's rhythm. It takes the paper
 * ground and a fraction of the usual vertical padding — utilities beat the
 * `main > section` rule in `globals.css`, which lives in `@layer base` — so it
 * reads as a rule drawn under the hero rather than as the page's second
 * section. On a phone the six wrap into a tidy block; from `lg` they run as one
 * line across the measure.
 */
export function TrustBar() {
  return (
    <Section
      id="trust"
      ground="paper"
      bandClassName="border-b border-(--raised-border) py-4 lg:py-5"
    >
      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:gap-x-8">
        {trustSignals.map((signal) => (
          <li
            key={signal}
            className="flex items-center gap-2 text-(--on-ground-muted)"
            style={{ fontSize: "var(--text-label)" }}
          >
            {/* The tick is the page's action green on paper — the one ground
                where green is unambiguous — and it is decoration: the words
                beside it already say the whole thing. */}
            <Check aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-(--color-green)" />
            {signal}
          </li>
        ))}
      </ul>
    </Section>
  );
}
