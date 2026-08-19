"use client";

import { useEffect, useRef, useState } from "react";
import { Section, SectionHeader } from "@/components/ui";
import { screenOptions } from "@/content/home";

/**
 * Four mesh options, read one at a time, with the answer to "which one is for
 * me" pinned beside them.
 *
 * The band is dark blue and the section is drawn in one other colour: the
 * palette's light blue. Nothing else. It is the only band on the page built out
 * of two tones of a single hue, and that is the point — this is a comparison of
 * four things that are all the same kind of thing, so the section is one colour
 * at two depths rather than a set of differently coloured cards. The dark is the
 * floor, the light is every mark on it: the labels, the rules, the option
 * titles, the fill of the panels.
 *
 * It keeps `ground="sky"` for its text roles — a dark ground's white body copy,
 * white focus ring, white action pill — and paints its own navy floor over the
 * ground's black. The photograph that used to be this band's floor is gone with
 * it; four panels of light blue want a plain dark field behind them, not a
 * picture.
 *
 * The scroll, and the thing that sticks
 * -------------------------------------
 * The options are a single centred column rather than a two-by-two grid, so
 * they arrive one at a time as you scroll — which is what makes the comparison
 * sequential instead of a wall you have to read four ways at once. Each panel
 * fades and rises into place as it comes up.
 *
 * Beside them, on the left and stuck to the middle of the window for the whole
 * length of the section, is the "Best for" line — and it changes as you go. It
 * is the part people actually scan, and pinning it means the answer for the
 * option you are reading is always in the same place on the screen rather than
 * buried at the foot of a card you have already scrolled past.
 *
 * Which option is current is decided by an `IntersectionObserver` with a middle
 * band for its root margin: an option counts as current while its top half is
 * crossing the middle of the window. That is steadier than measuring scroll
 * offsets and it costs nothing per frame. The pinned line crossfades on the
 * change — it is one element whose words swap, not four stacked and hidden.
 *
 * Below the breakpoint there is nothing to stick to: the column is the whole
 * width, and each option carries its own "Best for" line inside it.
 */
export function ScreenOptions() {
  const options = screenOptions.options;
  const [current, setCurrent] = useState(0);
  const panelsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const panels = panelsRef.current.filter((panel): panel is HTMLElement => Boolean(panel));
    if (panels.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = panels.indexOf(entry.target as HTMLElement);
          if (index >= 0) setCurrent(index);
        }
      },
      {
        // A band across the middle of the window: an option becomes current
        // when it reaches it, and stays current until the next one does.
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0,
      },
    );

    for (const panel of panels) observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  const bestFor = options[current]?.bestFor;

  return (
    <Section
      id="screen-options"
      ground="sky"
      labelledBy="screen-options-title"
      // The band's own floor, over the chrome ground's black. Utilities sort
      // after the base layer, so this wins without an `!important`.
      bandClassName="bg-navy"
    >
      <SectionHeader
        title={screenOptions.title}
        titleId="screen-options-title"
        intro={screenOptions.intro}
      />

      <div className="grid gap-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-16">
        {/* The pinned answer. `self-start` is what lets it stick — a stretched
            grid item is as tall as the column and has nothing to stick within.

            `mt` is where it starts and `top` is where it stops. It used to
            begin level with the top edge of the first panel, which put the
            label above the first line of the option it was answering and read
            as a heading for the column rather than as a line beside it. It now
            starts a panel's-worth lower, and comes to rest just under the
            middle of the window. */}
        <div className="hidden self-start lg:sticky lg:top-[calc(50vh-3rem)] lg:mt-28 lg:block">
          <p
            className="text-blue-soft font-title"
            style={{ fontSize: "var(--text-label)", letterSpacing: "0.16em" }}
          >
            BEST FOR
          </p>

          {/* One element, changing its words. `key` on the inner span restarts
              the fade on every change without four hidden copies in the DOM. */}
          <p className="mt-3 min-h-24 text-xl leading-snug">
            <span key={current} className="block animate-[best-for-in_420ms_ease-out]">
              {bestFor ?? "Anything the first three do not cover"}
            </span>
          </p>

          <span aria-hidden="true" className="bg-blue-soft/40 mt-6 block h-px w-full" />

          <p
            className="text-blue-soft/70 font-title mt-4 tabular-nums"
            style={{ fontSize: "var(--text-label)", letterSpacing: "0.16em" }}
          >
            {String(current + 1).padStart(2, "0")} / {String(options.length).padStart(2, "0")}
          </p>
        </div>

        {/* The options themselves: one column, centred, read in order. */}
        <ol className="flex flex-col gap-6 lg:gap-10">
          {options.map((option, i) => (
            <li key={option.title}>
              <article
                ref={(el) => {
                  panelsRef.current[i] = el;
                }}
                className={`border-blue-soft/25 rounded-3xl border bg-[color-mix(in_srgb,var(--color-blue-soft)_12%,transparent)] p-7 transition-[opacity,border-color] duration-500 lg:p-10 ${
                  i === current ? "border-blue-soft/60 opacity-100" : "opacity-70"
                }`}
              >
                <p
                  className="text-blue-soft/70 font-title tabular-nums"
                  style={{ fontSize: "var(--text-label)", letterSpacing: "0.16em" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </p>

                <h3 className="text-blue-soft mt-3 text-xl font-bold sm:text-2xl">
                  {option.title}
                </h3>

                <p className="mt-4 text-(--on-ground-muted)">{option.body}</p>

                {/* The same line the pinned column carries, for the widths that
                    have no pinned column. */}
                {option.bestFor ? (
                  <p className="border-blue-soft/25 mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t pt-5 lg:hidden">
                    <span
                      className="text-blue-soft font-title"
                      style={{ fontSize: "var(--text-label)", letterSpacing: "0.16em" }}
                    >
                      BEST FOR
                    </span>
                    <span className="text-(--on-ground-muted)">{option.bestFor}</span>
                  </p>
                ) : null}
              </article>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
