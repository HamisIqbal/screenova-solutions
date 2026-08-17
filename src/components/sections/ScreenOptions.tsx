import { Section, SectionHeader } from "@/components/ui";
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
 */
export function ScreenOptions() {
  return (
    <Section id="screen-options" ground="paper" labelledBy="screen-options-title">
      <SectionHeader
        eyebrow={screenOptions.eyebrow}
        title={screenOptions.title}
        titleId="screen-options-title"
        intro={screenOptions.intro}
      />

      <div className="mt-14 grid gap-4 md:grid-cols-2">
        {screenOptions.options.map((option) => (
          <article
            key={option.title}
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
    </Section>
  );
}
