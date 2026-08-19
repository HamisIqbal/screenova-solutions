"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { CtaLink, Section, SectionHeader } from "@/components/ui";
import { services } from "@/content/home";

/**
 * Six services, one card, driven by two arrows.
 *
 * These six are alternatives rather than steps — you need one of them, not all
 * of them — so they are handed over one at a time and at full size instead of
 * being laid out as six cards to compare. The card is deliberately large: the
 * whole measure wide and the better part of a screen tall, so a service is a
 * thing you are looking at rather than an entry in a list.
 *
 * The card is white on the blue band. That is the same reason this section has
 * always been able to be blue at all: a block of small copy on a solid blue
 * field is hard reading, and putting the words back on paper fixes it. It is
 * done with `data-ground="paper"`, so every role inside the card — text, muted
 * copy, the rule around the arrows — flips back to the white set without a
 * single child knowing it moved.
 *
 * ---------------------------------------------------------------------------
 * The layout is one grid that reads the same on both sides of the breakpoint:
 * words on one side, picture on the other. On a phone the two stack with the
 * picture first, which is the same order the desktop row reads in.
 *
 * The card's height is fixed rather than fitted to the copy. The six bodies are
 * not the same length, and a card that resized around each of them would move
 * the arrows every time they were pressed — the one control on the card would
 * be the one thing that will not hold still.
 *
 * The arrows are gone at the ends rather than greyed: there is no card before
 * the first or after the sixth, so there is nothing for the control to mean.
 * They keep their space (`invisible`, not `hidden`) so the pair does not shift
 * sideways on the first and last card, and they are `disabled` so a keyboard
 * cannot reach a control that is not there.
 *
 * Direction is tracked because the animation has to know it: pressing forward
 * sends the old card left and brings the new one in from the right, and
 * pressing back does the reverse. Without it every move looks the same and the
 * card stops feeling like a position in a sequence.
 */

const items = services.items;

/** How far a card sits off-centre as it enters or leaves, in px. */
const SLIDE = 48;

export function Services() {
  const [index, setIndex] = useState(0);
  /** +1 when the last move was forward, -1 when it was back. */
  const [direction, setDirection] = useState(1);

  const current = items[index] ?? items[0]!;
  const isFirst = index === 0;
  const isLast = index === items.length - 1;

  const go = (step: number) => {
    setDirection(step);
    setIndex((i) => Math.min(Math.max(i + step, 0), items.length - 1));
  };

  const slide = {
    enter: { opacity: 0, x: direction * SLIDE },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: direction * -SLIDE },
  };

  const transition = { duration: 0.42, ease: [0.25, 1, 0.5, 1] as const };

  return (
    <Section id="services" ground="blue" labelledBy="services-title">
      <SectionHeader title={services.title} titleId="services-title" intro={services.intro} />

      <div
        data-ground="paper"
        className="overflow-hidden rounded-3xl"
        // A slider is one region that swaps its contents, so it is announced as
        // one rather than as six things that keep appearing and disappearing.
        role="group"
        aria-roledescription="carousel"
        aria-label={services.title}
      >
        {/* Below the desktop breakpoint the card is one fixed-height stack and
            the two rows split it between them: the words take exactly the room
            their copy needs, and the picture takes everything that is left.
            That is the same fixed card height on all six — nothing moves under
            the arrows — but the dead white that used to sit under the shorter
            bodies is now photograph instead. On a short body the picture is
            more than twice the height it gets on the longest one.

            The phone height is 28.5rem rather than 25.5rem. The split is a
            fixed card less the copy, so the longest of the six bodies was
            leaving the picture barely more than its floor — a strip rather than
            a photograph. The three extra rem all go to the picture, because the
            words take what they take, and the card still fits a small screen. */}
        <div className="grid h-[28.5rem] grid-rows-[1fr_auto] sm:h-[34rem] lg:h-auto lg:grid-cols-2 lg:grid-rows-none">
          {/* The picture. First on a phone, second on a desktop — the words
              lead the reading order at both widths.

              Below the breakpoint it has no height of its own: it is the `1fr`
              row and takes whatever the words leave, with a floor so it can
              never collapse to a line. On a desktop the two sit side by side
              and it takes the card's full height. */}
          <div className="relative order-1 min-h-24 w-full lg:order-2 lg:h-[34rem]">
            <AnimatePresence initial={false}>
              <motion.div
                key={current.id}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1 }}
                transition={transition}
              >
                <Image
                  src={current.image}
                  alt={current.imageAlt}
                  fill
                  sizes="(min-width: 64rem) 36rem, 100vw"
                  className="object-cover"
                  priority={index === 0}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* The words. Below the breakpoint they are the `auto` row — as tall
              as the copy, no taller — so the six bodies still differ but the
              card does not: the difference is absorbed by the picture above.
              On a desktop the column is fixed to the card height instead, the
              copy is top-aligned inside it, and the controls sit at the bottom
              of the space whether or not the copy fills it. */}
          <div className="order-2 flex flex-col px-5 py-4 sm:p-10 lg:order-1 lg:h-[34rem] lg:p-10 xl:p-12">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.id}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                aria-live="polite"
              >
                {/* The counter is the one thing that goes on a phone: the tick
                    row under the arrows already says which of the six this is,
                    and its 30px of height is the difference between a card that
                    fits a small screen and one that does not. */}
                <p
                  className="font-title hidden text-(--on-ground-muted) tabular-nums sm:block"
                  style={{ fontSize: "var(--text-label)", letterSpacing: "0.16em" }}
                >
                  {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </p>

                {/* The type runs the other way at the two ends of the range.
                    On a phone it is stepped down so the whole card fits one
                    screen; on a wide screen the card is half a viewport of
                    white with room to spare, so the title and the copy are
                    both larger than the page's defaults — 44px and 17px —
                    which is what makes this read as the section's one big
                    thing rather than a paragraph sitting in a large box. */}
                <h3 className="text-lg leading-tight font-bold sm:mt-4 sm:text-2xl lg:text-[2rem] xl:text-[2.25rem]">
                  {current.title}
                </h3>

                <div className="mt-3 flex max-w-md flex-col gap-1.5 text-[0.8125rem] leading-snug text-(--on-ground-muted) sm:mt-5 sm:gap-3 sm:text-[length:var(--text-body)] sm:leading-normal lg:max-w-lg lg:gap-3 lg:text-base lg:leading-[1.6] xl:text-[1.0625rem] xl:leading-[1.55]">
                  {current.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* The controls, at the bottom of the column at every width so they
                are always in the same place on the card. */}
            <div className="mt-auto flex items-center gap-2.5 pt-5 sm:gap-3 sm:pt-6 lg:pt-8">
              <Arrow
                direction="previous"
                available={!isFirst}
                onClick={() => go(-1)}
                label={isFirst ? "" : `Previous service, ${items[index - 1]?.title}`}
              />
              <Arrow
                direction="next"
                available={!isLast}
                onClick={() => go(1)}
                label={isLast ? "" : `Next service, ${items[index + 1]?.title}`}
              />

              {/* Six ticks: which of the six this is, without counting. */}
              <div className="ml-2 flex gap-1.5 sm:ml-3" aria-hidden="true">
                {items.map((service, i) => (
                  <span
                    key={service.id}
                    className={`h-0.5 w-4 rounded-full transition-all duration-300 sm:w-6 ${
                      i === index ? "bg-(--on-ground)" : "bg-(--on-ground)/25"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The call to action, under the card rather than inside it. One card is
          shown at a time, so a link buried in the copy moved with the words and
          read as belonging to that one service. Out here it sits still on the
          blue while the card changes behind the arrows, and it is the only
          thing on the band below the card — the last thing the section says.

          It is the pill rather than an underlined link because it is now alone
          on the blue: a line of text under a very large white card has nothing
          to hold it, while the pill puts a surface of its own beneath the words
          — white on this band, the same shape as every other action on the
          page. */}
      {/* The same distance above as the band's own floor leaves below it, so
          the pill sits centred in the space between the card and the next
          section rather than tucked under the card. */}
      <div className="mt-[clamp(3rem,8vw,6rem)] flex justify-center">
        <CtaLink href="#quote">{current.cta ?? "Get a Quote"}</CtaLink>
      </div>
    </Section>
  );
}

/**
 * One of the two controls. `available` is what makes it exist: unavailable, it
 * keeps its 48px of space so the pair never shifts, but it is invisible,
 * unfocusable, and unannounced.
 */
function Arrow({
  direction,
  available,
  onClick,
  label,
}: {
  direction: "previous" | "next";
  available: boolean;
  onClick: () => void;
  label: string;
}) {
  const Icon = direction === "previous" ? ArrowLeft : ArrowRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!available}
      aria-hidden={!available}
      aria-label={label}
      className={[
        // `button` is the green action pill by default — see globals. An arrow
        // is a control, not an action, so it opts out of the fill and the
        // padding and keeps only the type colour.
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-transparent p-0 sm:h-12 sm:w-12",
        "border-(--rule)/40 text-(--on-ground) transition-colors duration-300",
        "hover:bg-(--on-ground) hover:text-(--ground)",
        available ? "" : "invisible",
      ].join(" ")}
    >
      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
    </button>
  );
}
