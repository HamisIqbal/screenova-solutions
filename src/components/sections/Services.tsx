"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "motion/react";

import { TextRotate, type TextRotateRef } from "@/components/ui/text-rotate";
import { services } from "@/content/home";

/**
 * The six services, told one at a time, on a stage that is six screens tall.
 *
 * The mechanic is the oldest one in scroll-telling and the reason it is used
 * here is that these six are alternatives rather than steps: a grid of six
 * cards asks the reader to compare them, and comparing six things is work.
 * Handed one at a time, each service gets the whole screen and the reader is
 * asked only "is this the one I need?" six times over.
 *
 * ---------------------------------------------------------------------------
 * How the six screens are built, since nothing here is measuring scroll:
 *
 *   - The band is `600vh` tall — six screens exactly, so the section starts as
 *     the first service arrives and ends as the sixth leaves. There is no
 *     seventh screen of heading, which is why the eyebrow lives inside the
 *     panel rather than above it.
 *   - One `sticky top-0 h-svh` panel is pinned inside it. That panel is the
 *     only thing ever seen; it does not move for the whole six screens.
 *   - Six invisible tracks are laid over the band, one screen each, and each
 *     watches itself with `useInView` shrunk to the viewport's centre line
 *     (`-50%` top and bottom). A 100vh track can only cross that line while it
 *     owns the middle of the screen, so exactly one is ever in view and the
 *     active index is whichever one says so. No scroll listener, no rAF, no
 *     layout reads.
 *
 * The title and the paragraph are the same `TextRotate`, driven by ref rather
 * than by its own timer — `auto={false} loop={false}`, and the tracks call
 * `jumpTo`. The title is split by characters so it types itself in; the
 * paragraph by words, because sixty characters of stagger on body copy reads as
 * a fault rather than as an effect. The picture crossfades underneath on the
 * same index.
 *
 * `min-h-svh` rather than `vh`: on a phone the browser chrome collapses as you
 * scroll and `vh` would leave the panel a chrome's-height too tall for the
 * whole six screens.
 */

const items = services.items;

/**
 * One screen of the band. It renders nothing — it exists to notice when it is
 * the one in the middle of the window and to say so.
 */
function Track({ index, onActive }: { index: number; onActive: (index: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-50% 0px -50% 0px" });

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return <div ref={ref} className="flex-1" aria-hidden="true" />;
}

export function Services() {
  const [active, setActive] = useState(0);
  const titleRef = useRef<TextRotateRef>(null);
  const bodyRef = useRef<TextRotateRef>(null);

  /* `active` only ever comes from a track's own index, so it is always in
     range — the fallback is here for `noUncheckedIndexedAccess`, not for a
     case that happens. */
  const current = items[active] ?? items[0]!;

  const onActive = useCallback((index: number) => {
    setActive(index);
    titleRef.current?.jumpTo(index);
    bodyRef.current?.jumpTo(index);
  }, []);

  return (
    <section
      id="services"
      data-ground="blue"
      aria-labelledby="services-title"
      // `py-0` drops the band padding every other section gets. That padding is
      // the rhythm between bands, and a pinned stage has no rhythm to keep — it
      // is six screens of scroll, and 192px of it spent on padding would make
      // the section 6.2 screens long instead of six. The panel keeps its own
      // clearance from the fixed header instead.
      className="relative py-0!"
    >
      {/* The panel, pinned. It is first in the flow and one screen tall, and
          the spacer beneath it supplies the other five — together they are the
          600vh the section is, and the panel stays put across all of it. */}
      <div className="sticky top-0 h-svh">
        <div className="max-w-page px-gutter mx-auto flex h-full w-full items-center pt-(--header-clearance) pb-14">
          <div className="grid w-full items-center gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Left: the words. Everything in this column is on the same index,
                so the whole column turns over as one gesture. */}
            <div className="order-2 lg:order-1">
              <p
                className="font-title text-(--on-ground-muted)"
                style={{ fontSize: "var(--text-label)", letterSpacing: "0.16em" }}
              >
                {services.eyebrow.toUpperCase()}
              </p>

              {/* The band's real heading, for the outline and for `aria-labelledby`.
                  It is not shown: the panel already carries the eyebrow, and a
                  second static line above six rotating ones would be a third
                  thing competing for the same corner. */}
              <h2 id="services-title" className="sr-only">
                {services.title}
              </h2>

              <h3 className="mt-5">
                <TextRotate
                  ref={titleRef}
                  texts={items.map((service) => service.title)}
                  auto={false}
                  loop={false}
                  splitBy="characters"
                  staggerFrom="first"
                  staggerDuration={0.012}
                  mainClassName="font-title text-3xl leading-[1.05] font-bold sm:text-5xl lg:text-6xl"
                  splitLevelClassName="overflow-hidden pb-1"
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-110%", opacity: 0 }}
                  transition={{ type: "spring", duration: 0.55, bounce: 0 }}
                />
              </h3>

              <div className="mt-6 max-w-md text-(--on-ground-muted)">
                <TextRotate
                  ref={bodyRef}
                  texts={items.map((service) => service.body.join(" "))}
                  auto={false}
                  loop={false}
                  splitBy="words"
                  staggerFrom="first"
                  staggerDuration={0.006}
                  mainClassName="block"
                  splitLevelClassName="overflow-hidden"
                  initial={{ y: "60%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-40%", opacity: 0 }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0 }}
                />
              </div>

              {/* Where you are in the six. The rules are the progress bar and
                  the count is the same information in words — a scroll-pinned
                  section has to say how long it is or it reads as stuck. */}
              <div className="mt-9 flex items-center gap-4">
                <div className="flex gap-1.5" aria-hidden="true">
                  {items.map((service, i) => (
                    <span
                      key={service.id}
                      className={`h-0.5 w-7 rounded-full transition-all duration-500 ${
                        i === active ? "bg-(--on-ground)" : "bg-(--on-ground)/30"
                      }`}
                    />
                  ))}
                </div>

                <span
                  className="text-(--on-ground-muted) tabular-nums"
                  style={{ fontSize: "var(--text-label)" }}
                >
                  {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </span>
              </div>

              <p className="mt-7">
                <a href="#quote">{current.cta ?? "Get a Quote"}</a>
              </p>
            </div>

            {/* Right: the picture. One frame, six images crossfading through it,
                so the frame itself never moves — the panel is a window onto the
                service, not six slides going past. */}
            <div className="relative order-1 aspect-4/5 w-full overflow-hidden rounded-3xl lg:order-2 lg:aspect-4/5 lg:max-h-[70svh] lg:justify-self-end">
              <AnimatePresence initial={false}>
                <motion.div
                  key={current.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                >
                  <Image
                    src={current.image}
                    alt={current.imageAlt}
                    fill
                    sizes="(min-width: 64rem) 34rem, 92vw"
                    className="object-cover"
                    priority={active === 0}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* The remaining five screens. Nothing is ever drawn here. */}
      <div className="h-[500svh]" aria-hidden="true" />

      {/* Six tracks laid over the whole band, one screen each, reporting which
          of them owns the middle of the window. `pointer-events-none` so the
          overlay never comes between the pointer and the quote link. */}
      <div className="pointer-events-none absolute inset-0 flex flex-col">
        {items.map((service, i) => (
          <Track key={service.id} index={i} onActive={onActive} />
        ))}
      </div>
    </section>
  );
}
