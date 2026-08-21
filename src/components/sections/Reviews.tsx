import { Star } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui";
import { reviews } from "@/content/home";

/**
 * Reviews — and, today, nothing at all.
 *
 * `reviews.items` is empty in `content/home.ts`, and while it is empty this
 * component returns `null`: no band, no heading, no skeleton, no "reviews
 * coming soon". A review section with invented names on it is the one piece of
 * fakery on a site like this that people actually act on, so the section simply
 * does not exist until there is something true to put in it.
 *
 * To publish: paste 3–6 genuine reviews from the Google Business Profile into
 * `reviews.items` in the documented shape — rating, name, city, body — and the
 * band appears on its own with no code change here. Use each reviewer's name
 * exactly as the profile shows it.
 *
 * The card is what the brief asked for, in order: the stars, the name, the
 * city, the review. The stars are drawn from `rating` rather than hard-coded to
 * five — a four-star review is a real review, and a component that can only
 * render five stars is a component that will eventually misreport one.
 *
 * The band is blue and sits directly above the quote form, which is also blue:
 * the last thing read before the ask, on the same ground, so the two read as
 * one move rather than as two sections.
 */
export function Reviews() {
  if (reviews.items.length === 0) return null;

  return (
    <Section id="reviews" ground="blue" labelledBy="reviews-title">
      <SectionHeader title={reviews.title} titleId="reviews-title" />

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.items.map((review) => (
          <li key={`${review.name}-${review.body.slice(0, 24)}`}>
            <div data-ground="paper" className="flex h-full flex-col rounded-2xl px-6 py-6">
              {/* The rating as text for anything not looking at it, and as five
                  marks for anything that is. */}
              <p className="sr-only">{review.rating} out of 5 stars</p>
              <p aria-hidden="true" className="flex gap-0.5 text-(--spark)">
                {[1, 2, 3, 4, 5].map((position) => (
                  <Star
                    key={position}
                    className="h-4 w-4"
                    fill={position <= review.rating ? "currentColor" : "none"}
                    strokeWidth={1.5}
                  />
                ))}
              </p>

              <p className="mt-4 font-medium">{review.name}</p>
              <p className="text-(--on-ground-muted)" style={{ fontSize: "var(--text-label)" }}>
                {review.city}
              </p>

              <p className="mt-4 text-(--on-ground-muted)">{review.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
