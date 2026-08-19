import { BandPhoto, Section, SectionHeader } from "@/components/ui";
import { bandImages, screenOptions } from "@/content/home";

/**
 * Four mesh options, on a photograph. Wider cards than Services because the
 * decision here is a comparison — the "Best for" line is the part people
 * actually scan, so it gets the chip and sits on its own row at the foot of
 * each card.
 *
 * The band was paper and is now `sky`, because its floor is a picture. The
 * cards are what makes that a small change rather than a redesign: each one
 * re-declares `data-ground="paper"`, which is the same move the quote form
 * makes, and inside that boundary every role goes back to what it was — the
 * mist fill, the hairline border, navy text, and the sunset chip carrying navy
 * at 6.7:1. Nothing inside a card knows the band moved.
 *
 * That chip is still one of only two places sunset appears at all, and it is
 * still on white — the card's white, not the band's. Sunset on the photograph
 * itself would not read, which is exactly the rule it has always followed.
 *
 * What did change is what the cards are: on paper they were a tint lifted a
 * step off the page, and on a darkened photograph they are light panels
 * floating over it. Same fill, much more separation. The comparison reads
 * harder here than it did on white.
 *
 * The photograph is the one portrait source of the three, which is what
 * recommends it: this is the tallest band on the page, and a landscape crop
 * would be pulled to a sliver of itself.
 */
export function ScreenOptions() {
  return (
    <Section
      id="screen-options"
      ground="sky"
      labelledBy="screen-options-title"
      // `clip` rather than `hidden`: it holds the cropped edges of the
      // photograph without making a scroll container.
      bandClassName="relative overflow-clip"
    >
      <BandPhoto {...bandImages.screenOptions} />

      {/* `relative`, so the content paints above the picture and its scrim —
          both are positioned, and a static sibling would sit under them. */}
      <div className="relative">
        <SectionHeader
          title={screenOptions.title}
          titleId="screen-options-title"
          intro={screenOptions.intro}
        />

        <div className="grid gap-4 md:grid-cols-2">
          {screenOptions.options.map((option) => (
            <article
              key={option.title}
              // The card is its own ground, so everything in it is coloured by
              // the card and not by the band behind it.
              data-ground="paper"
              className="flex flex-col rounded-3xl border border-(--raised-border) bg-(--raised) p-7"
            >
              <h3>{option.title}</h3>
              <p className="mt-4 text-(--on-ground-muted)">{option.body}</p>

              {option.bestFor ? (
                <p className="mt-auto flex flex-wrap items-baseline gap-x-3 gap-y-2 pt-6">
                  <span
                    className="font-title rounded-full bg-(--spark) px-3 py-1 text-(--on-spark)"
                    style={{ fontSize: "var(--text-label)", fontWeight: 400 }}
                  >
                    Best for
                  </span>
                  <span className="text-(--on-ground-muted)">{option.bestFor}</span>
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
