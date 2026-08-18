import { CardStage, RevealCard, Section, SectionHeader, Typewriter } from "@/components/ui";
import { screenOptions } from "@/content/home";

/**
 * Four mesh options, back on white. Wider cards than Services because the
 * decision here is a comparison — the "Best for" line is the part people
 * actually scan, so it gets the chip and sits on its own row at the foot of
 * each card.
 *
 * That chip is sunset — one of only two places sunset appears at all. It sits
 * on a white band, which is the only ground sunset is legible on, and it
 * carries navy at 6.7:1. This is the section where the hottest colour in the
 * palette earns its keep: it marks the one line in a comparison that decides
 * the comparison.
 *
 * The backdrop matters more here than anywhere else on the page, because the
 * four things being compared are four *materials* and the difference between
 * them is visual. The photographs behind these cards are macro shots of the
 * meshes themselves, shot as a set — see the `detail` lines in
 * `content/home.ts` — so scrolling the comparison shows you the weave you are
 * reading about.
 */
export function ScreenOptions() {
  return (
    <Section
      id="screen-options"
      ground="paper"
      labelledBy="screen-options-title"
      bandClassName="relative isolate"
    >
      <SectionHeader
        eyebrow={screenOptions.eyebrow}
        title={screenOptions.title}
        titleId="screen-options-title"
        intro={screenOptions.intro}
      />

      <CardStage
        as="div"
        images={screenOptions.options.map((option) => option.image)}
        columns={2}
        className="mt-14 grid gap-4 md:grid-cols-2"
      >
        {screenOptions.options.map((option, index) => (
          <RevealCard
            key={option.title}
            as="article"
            index={index}
            // The card is `--raised` over a band that now has a picture in it,
            // so it stays opaque on purpose: this is a comparison, and the four
            // panels have to read as four equal surfaces rather than four
            // different crops of whatever is behind them.
            className="flex flex-col rounded-3xl border border-(--raised-border) bg-(--raised) p-7 transition-[transform,border-color,box-shadow] duration-500 ease-(--ease-out-expo) hover:-translate-y-1.5 hover:border-(--rule) hover:shadow-[0_18px_40px_-24px_rgba(7,26,47,0.35)] data-[active=true]:border-(--rule)"
          >
            <h3>
              <Typewriter text={option.title} />
            </h3>
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
          </RevealCard>
        ))}
      </CardStage>
    </Section>
  );
}
