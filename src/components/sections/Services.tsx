"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { CtaLink, Section, SectionHeader } from "@/components/ui";
import { services } from "@/content/home";

/**
 * Seven services, one at a time, and two different ways of handing them over.
 *
 * These seven are alternatives rather than steps — you need one of them, not all
 * of them — so they are shown one at a time and at full size instead of being
 * laid out as seven cards to compare.
 *
 * ---------------------------------------------------------------------------
 * The row of names above is what fixes the section's real problem: a carousel
 * showing one thing at a time meant a visitor who did not touch the arrows saw
 * "New Window Screens" and concluded that was the business. Six other services
 * existed and none of them was on the screen. The index says all seven at once,
 * in one wrapped block, and each name is also the control that brings its
 * service up — so the list is both the answer to "what do you do" and the way
 * to read about any of it. It is the same block at every width, wrapped and
 * centred, and it does not move as the carousel does.
 *
 * It is a list of buttons rather than links: they move the carousel, they do
 * not navigate. The four services that *do* have a page of their own carry a
 * separate "More on…" link inside the slide, which is where a navigation
 * belongs.
 *
 * ---------------------------------------------------------------------------
 * Below `lg`: a scroller, built the way a phone photo carousel is built.
 *
 * All seven services are laid out in one horizontal strip, each exactly the
 * width of the window, inside a `snap-x snap-mandatory` overflow container. The
 * whole gesture is then the browser's: the strip tracks the finger one-to-one,
 * carries its own momentum, rubber-bands at both ends, and settles on a slide
 * rather than between two. Nothing is animated on release and nothing waits for
 * a threshold to be met — there is no transition to interrupt, because moving
 * *is* the scroll position. React only listens: `onScroll` divides the offset by
 * the slide width and records which one is in front, which is what keeps the
 * name row above in step.
 *
 * The card is gone at this width. A rounded panel inset from both edges spent
 * about 48px of a 390px screen on margin and corner, and it read as one object
 * sitting on the band — which is exactly the wrong signal for something you are
 * meant to push sideways. Each slide is a plain rectangle running window edge to
 * window edge (`-mx-gutter`, the band's gutter given back inside), so the strip
 * reads as a strip and the next photograph is what is on the other side of the
 * frame.
 *
 * The one piece of chrome is the count, over the top right corner of the
 * photograph: small, half-faded, no border and no controls. It says where you
 * are in the seven and nothing else — the gesture does not need explaining to
 * anybody holding a phone.
 *
 * ---------------------------------------------------------------------------
 * At `lg` and up: the card, unchanged.
 *
 * There is no finger, so the slide is swapped rather than scrolled — one card,
 * white on the blue band, with two arrows and a row of ticks. Direction is
 * tracked because the animation has to know it: pressing forward sends the old
 * card left and brings the new one in from the right, and pressing back does
 * the reverse. Without it every move looks the same and the card stops feeling
 * like a position in a sequence.
 *
 * The card is white on the blue band. That is the same reason this section has
 * always been able to be blue at all: a block of small copy on a solid blue
 * field is hard reading, and putting the words back on paper fixes it. It is
 * done with `data-ground="paper"`, so every role inside — text, muted copy, the
 * rule around the arrows — flips back to the white set without a single child
 * knowing it moved. The mobile strip declares the same ground for the same
 * reason.
 *
 * The card's height is fixed rather than fitted to the copy. The seven bodies
 * are not the same length, and a card that resized around each of them would
 * move the arrows every time they were pressed — the one control on the card
 * would be the one thing that will not hold still.
 *
 * The arrows are gone at the ends rather than greyed: there is no card before
 * the first or after the last, so there is nothing for the control to mean.
 * They keep their space (`invisible`, not `hidden`) so the pair does not shift
 * sideways on the first and last card, and they are `disabled` so a keyboard
 * cannot reach a control that is not there.
 *
 * ---------------------------------------------------------------------------
 * Both renderings are in the markup and the breakpoint picks one — `lg:hidden`
 * on the strip, `hidden lg:block` on the card. They are two different objects
 * built from the same seven services and they share `index`, so a name tapped
 * in the row above lands in whichever one is on screen.
 */

const items = services.items;

/** How far a card sits off-centre as it enters or leaves, in px. Desktop only. */
const SLIDE = 48;

export function Services() {
  const [index, setIndex] = useState(0);
  /** +1 when the last move was forward, -1 when it was back. Desktop only. */
  const [direction, setDirection] = useState(1);

  /** The mobile strip, so a name tapped above can scroll it. */
  const stripRef = useRef<HTMLUListElement>(null);

  const current = items[index] ?? items[0]!;
  const isFirst = index === 0;
  const isLast = index === items.length - 1;

  const go = (step: number) => {
    setDirection(step);
    setIndex((i) => Math.min(Math.max(i + step, 0), items.length - 1));
  };

  /**
   * The index row's jump. It sets the state the desktop card reads *and*
   * scrolls the mobile strip — only one of the two is on screen, and this does
   * not need to know which.
   *
   * The width is read off the strip rather than assumed, and a zero width means
   * the strip is the hidden one (`display: none` has no layout), so the scroll
   * is skipped rather than sending a hidden container to offset zero and
   * stranding it there when the window is next made narrow.
   */
  const jumpTo = (next: number) => {
    if (next === index) return;
    setDirection(next > index ? 1 : -1);
    setIndex(next);

    const strip = stripRef.current;
    if (strip && strip.clientWidth > 0) {
      strip.scrollTo({ left: next * strip.clientWidth, behavior: "smooth" });
    }
  };

  /**
   * Which slide the strip has settled in front of. Rounding is what makes this
   * agree with `snap-mandatory`: mid-gesture the answer is whichever slide is
   * more than half in frame, which is also the one the snap will choose if the
   * finger lifts now, so the name row never disagrees with where the strip is
   * about to stop.
   */
  const onStripScroll = () => {
    const strip = stripRef.current;
    if (!strip || strip.clientWidth === 0) return;
    const next = Math.min(Math.round(strip.scrollLeft / strip.clientWidth), items.length - 1);
    if (next !== index) setIndex(next);
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

      {/* All seven, above the carousel, always visible and in the same wrapped
          block at every width. `-mt` pulls the row up into the space the header
          leaves so it reads as part of the header rather than as a third
          block. */}
      <ul className="mx-auto -mt-[clamp(1.5rem,4vw,3rem)] mb-8 flex max-w-3xl flex-wrap justify-center gap-2">
        {items.map((service, i) => (
          <li key={service.id}>
            <button
              type="button"
              onClick={() => jumpTo(i)}
              aria-current={i === index ? "true" : undefined}
              className={[
                "font-title cursor-pointer rounded-full border px-3.5 py-1.5 transition-colors duration-300",
                i === index
                  ? "border-(--on-ground) bg-(--on-ground) text-(--ground)"
                  : "border-(--on-ground)/40 bg-transparent text-(--on-ground) hover:border-(--on-ground)",
              ].join(" ")}
              style={{ fontSize: "var(--text-label)", fontWeight: 500 }}
            >
              {service.title}
            </button>
          </li>
        ))}
      </ul>

      {/* ------------------------------------------------------------------ */}
      {/* The phone's strip. See the note above. */}
      <ul
        ref={stripRef}
        onScroll={onStripScroll}
        data-ground="paper"
        // `-mx-gutter` cancels the band's gutter so a slide is exactly the width
        // of the window; the gutter comes back on the words inside each slide,
        // never on the photograph. `snap-x snap-mandatory` is the whole gesture.
        // The scrollbar is hidden in both engines — on a touch screen it is an
        // 8px grey line under a photograph and nothing else.
        className="-mx-gutter [&::-webkit-scrollbar]:hidden flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain lg:hidden"
        style={{ scrollbarWidth: "none" }}
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label={services.title}
      >
        {items.map((service, i) => (
          <li
            key={service.id}
            className="w-full shrink-0 snap-center snap-always bg-(--ground)"
            role="group"
            aria-roledescription="slide"
            aria-label={`${service.title}, ${i + 1} of ${items.length}`}
          >
            {/* A fixed rectangle rather than an aspect ratio: every photograph
                has to be the same height or the words below them step up and
                down as the strip moves. */}
            <div className="relative h-56 w-full sm:h-72">
              <Image
                src={service.image}
                alt={service.imageAlt}
                fill
                sizes="100vw"
                className="object-cover"
                priority={i === 0}
              />

              {/* The only chrome on the strip. Half-faded white on a soft dark
                  patch, because the corner of a photograph is not a colour this
                  can be told in advance — the patch is what guarantees the
                  digits are legible over a bright window or a dark frame alike.
                  `aria-hidden`: each slide already announces "3 of 7" as part of
                  its own label, and a screen reader has no use for the same fact
                  painted into the corner. */}
              <span
                aria-hidden="true"
                className="font-title absolute top-3 right-3 rounded-full bg-black/35 px-2 py-0.5 tabular-nums text-white/85 backdrop-blur-[2px]"
                style={{ fontSize: "0.6875rem", letterSpacing: "0.04em" }}
              >
                {i + 1}/{items.length}
              </span>
            </div>

            {/* The words, on paper, with the band's gutter given back. */}
            <div className="px-gutter py-6">
              <h3 className="text-lg leading-tight font-bold sm:text-2xl">{service.title}</h3>

              <div className="mt-3 flex flex-col gap-1.5 text-[0.8125rem] leading-snug text-(--on-ground-muted) sm:gap-3 sm:text-[length:var(--text-body)] sm:leading-normal">
                {service.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              {/* Only the services that actually have a page get a link to one.
                  `href` is absent on the other three, and an absent href is the
                  whole guard against a broken link. */}
              {service.href && (
                <p className="mt-4">
                  <Link href={service.href} style={{ fontSize: "var(--text-label)" }}>
                    More on {service.title}
                  </Link>
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* ------------------------------------------------------------------ */}
      {/* The desktop card. */}
      <div
        data-ground="paper"
        className="hidden overflow-hidden rounded-3xl lg:block"
        // A slider is one region that swaps its contents, so it is announced as
        // one rather than as seven things that keep appearing and disappearing.
        role="group"
        aria-roledescription="carousel"
        aria-label={services.title}
      >
        <div className="grid lg:grid-cols-2">
          {/* The picture. Second in the row — the words lead the reading
              order. */}
          <div className="relative order-2 h-[34rem] w-full">
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
                  sizes="36rem"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* The words. The column is fixed to the card height, the copy is
              top-aligned inside it, and the controls sit at the bottom of the
              space whether or not the copy fills it. */}
          <div className="order-1 flex h-[34rem] flex-col p-10 xl:p-12">
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
                  className="font-title tabular-nums text-(--on-ground-muted)"
                  style={{ fontSize: "var(--text-label)", letterSpacing: "0.16em" }}
                >
                  {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </p>

                {/* The card is half a viewport of white with room to spare, so
                    the title and the copy are both larger than the page's
                    defaults — 44px and 17px — which is what makes this read as
                    the section's one big thing rather than a paragraph sitting
                    in a large box. */}
                <h3 className="mt-4 text-[2rem] leading-tight font-bold xl:text-[2.25rem]">
                  {current.title}
                </h3>

                <div className="mt-5 flex max-w-lg flex-col gap-3 text-base leading-[1.6] text-(--on-ground-muted) xl:text-[1.0625rem] xl:leading-[1.55]">
                  {current.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                {current.href && (
                  <p className="mt-5">
                    <Link href={current.href} style={{ fontSize: "var(--text-label)" }}>
                      More on {current.title}
                    </Link>
                  </p>
                )}
              </motion.div>
            </AnimatePresence>

            {/* The controls, at the bottom of the column so they are always in
                the same place on the card. */}
            <div className="mt-auto flex items-center gap-3 pt-8">
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

              {/* Seven ticks: which of the seven this is, without counting. */}
              <div className="ml-3 flex gap-1.5" aria-hidden="true">
                {items.map((service, i) => (
                  <span
                    key={service.id}
                    className={`h-0.5 w-6 rounded-full transition-all duration-300 ${
                      i === index ? "bg-(--on-ground)" : "bg-(--on-ground)/25"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The call to action, under the carousel rather than inside it. One
          service is shown at a time, so a link buried in the copy moved with the
          words and read as belonging to that one service. Out here it sits still
          on the blue while the slides move, and it is the only thing on the band
          below them — the last thing the section says.

          It is the pill rather than an underlined link because it is alone on
          the blue: a line of text under a very large white surface has nothing
          to hold it, while the pill puts a surface of its own beneath the words
          — white on this band, the same shape as every other action on the
          page. */}
      {/* The same distance above as the band's own floor leaves below it, so
          the pill sits centred in the space between the carousel and the next
          section rather than tucked under it. */}
      <div className="mt-[clamp(3rem,8vw,6rem)] flex flex-col items-center gap-6 text-center">
        {/* For the visitor who cannot tell which of the seven they need — which
            is most of them. It names the one thing that settles it, and the
            quote form's photo upload is what makes that a real offer. */}
        <p className="mx-auto font-medium">{services.help}</p>

        <CtaLink href="#quote">{current.cta ?? "Get a Quote"}</CtaLink>

        {/* The whole-home line, and the only place on the page it appears. */}
        <p className="mx-auto text-(--on-ground-muted)">{services.wholeHome}</p>
      </div>
    </Section>
  );
}

/**
 * One of the two desktop controls. `available` is what makes it exist:
 * unavailable, it keeps its 48px of space so the pair never shifts, but it is
 * invisible, unfocusable, and unannounced.
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
