"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Section, SectionHeader } from "@/components/ui";
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
 * copy, the rule around the arrows, the link underline — flips back to the
 * white set without a single child knowing it moved.
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
      <SectionHeader
        eyebrow={services.eyebrow}
        title={services.title}
        titleId="services-title"
        intro={services.intro}
      />

      <div
        data-ground="paper"
        className="mt-12 overflow-hidden rounded-3xl"
        // A slider is one region that swaps its contents, so it is announced as
        // one rather than as six things that keep appearing and disappearing.
        role="group"
        aria-roledescription="carousel"
        aria-label={services.title}
      >
        <div className="grid lg:grid-cols-2">
          {/* The picture. First on a phone, second on a desktop — the words
              lead the reading order at both widths. */}
          <div className="relative order-1 aspect-4/3 w-full sm:aspect-video lg:order-2 lg:aspect-auto lg:h-[32rem]">
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

          {/* The words. Fixed height on a desktop so the arrows never move; the
              copy is top-aligned inside it and the controls sit at the bottom. */}
          <div className="order-2 flex flex-col p-7 sm:p-10 lg:order-1 lg:h-[32rem] lg:p-12">
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
                <p
                  className="font-title text-(--on-ground-muted) tabular-nums"
                  style={{ fontSize: "var(--text-label)", letterSpacing: "0.16em" }}
                >
                  {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </p>

                <h3 className="mt-4 text-2xl font-bold sm:text-3xl lg:text-4xl">{current.title}</h3>

                <div className="mt-5 flex max-w-md flex-col gap-3 text-(--on-ground-muted)">
                  {current.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                <p className="mt-7">
                  <a href="#quote">{current.cta ?? "Get a Quote"}</a>
                </p>
              </motion.div>
            </AnimatePresence>

            {/* The controls, at the bottom of the column at every width so they
                are always in the same place on the card. */}
            <div className="mt-10 flex items-center gap-3 lg:mt-auto lg:pt-8">
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
                    className={`h-0.5 w-4 rounded-full sm:w-6 transition-all duration-300 ${
                      i === index ? "bg-(--on-ground)" : "bg-(--on-ground)/25"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
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
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border bg-transparent p-0",
        "border-(--rule)/40 text-(--on-ground) transition-colors duration-300",
        "hover:bg-(--on-ground) hover:text-(--ground)",
        available ? "" : "invisible",
      ].join(" ")}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
