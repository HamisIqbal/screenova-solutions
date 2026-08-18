"use client";

import Image from "next/image";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/animations";
import { useIsomorphicLayoutEffect, usePrefersReducedMotion } from "@/hooks";

/**
 * A stage: a grid of cards that arrive one at a time on scroll, over a
 * photograph that changes with whichever card you are reading.
 *
 * ---------------------------------------------------------------------------
 * The backdrop, and why it is `multiply`.
 *
 * A picture behind a whole band is easy to make and hard to make safe — the
 * band's text was measured against a flat colour, and dropping an image under
 * it moves every one of those numbers. The blue ground is the binding case:
 * white on blue is 4.72:1 with no headroom at all, so a photograph laid over it
 * at any opacity that lightens even one pixel takes the copy below 4.5:1.
 * Normal blending at 10% already lands it at 4.03:1, which is a fail.
 *
 * `mix-blend-multiply` removes the problem rather than budgeting around it.
 * Multiply can only ever darken, so on blue the ground under the white copy
 * gets darker and the contrast can only go up from 4.72:1. On paper the same
 * blend costs navy some of its 17.5:1 — at the tint used here the worst case is
 * about 12:1, which is still twice what body text needs.
 *
 * That is what makes the tint a per-ground token instead of one number:
 * `--stage-tint` in `globals.css` gives paper the lighter hand, because paper
 * is the ground that pays for the blend, and lets blue take more, because blue
 * is the ground the blend helps.
 *
 * The layer sits at `-z-10`, which puts it above the band's own colour and
 * below every in-flow sibling — over the ground, under the cards, with nothing
 * else in the section needing to know it is there.
 *
 * That only works if the band is `relative isolate`, and both words are
 * load-bearing. `relative` gives the layer its containing block so `inset-0`
 * reaches the window rather than the measure. `isolate` makes the band a
 * stacking context, and without it a negative z-index child does not stop at
 * the band — it rises to the root stacking context and paints *underneath* the
 * band's own background, where it is invisible. Making the band a stacking
 * context also bounds the blend, so the multiply cannot reach the section
 * below.
 *
 * ---------------------------------------------------------------------------
 * The reveal.
 *
 * Each card owns its own ScrollTrigger rather than the grid owning one for all
 * of them, which is what makes them arrive individually as you travel down the
 * page instead of as a single burst when the group's top edge crosses the line.
 * Within a row they are still separated by a delay taken from the card's
 * column, so a three-across row reads left to right rather than landing flat.
 *
 * A second trigger per card — a band around the middle of the viewport — is
 * what drives the backdrop. Whichever card is crossing the reading line owns
 * the picture.
 *
 * Nothing here is in the server-rendered CSS: the cards ship visible and the
 * hidden state is applied by GSAP after mount. If JavaScript never runs, the
 * section is a plain grid of cards, which is what it was before.
 */

type StageImage = {
  src: string;
  alt: string;
};

type StageContextValue = {
  activate: (index: number) => void;
  activeIndex: number;
  columns: number;
};

const StageContext = createContext<StageContextValue | null>(null);

function useStage() {
  const stage = useContext(StageContext);
  if (!stage) throw new Error("RevealCard must be rendered inside a CardStage.");
  return stage;
}

/**
 * Whether the nearest card has arrived yet.
 *
 * This is context rather than a render prop for one hard reason: the sections
 * that use these cards are Server Components, and a Server Component cannot
 * hand a function to a Client Component. Card contents therefore travel as
 * plain `children`, and anything inside them that needs to know when the card
 * landed — `<Typewriter>` — reads it from here instead of being passed it.
 *
 * Defaults to false. A `<Typewriter>` is only ever meant to live inside a card,
 * and false is also the value the server renders with, which is what keeps the
 * un-split plain text the same on both sides of hydration.
 */
const RevealContext = createContext(false);

export function useRevealed() {
  return useContext(RevealContext);
}

export function CardStage({
  images,
  columns = 3,
  as: Tag = "ul",
  className = "",
  children,
}: {
  /** One per card, in card order. Index i backs the card at index i. */
  images: readonly StageImage[];
  /** Card count in a row at the widest breakpoint. Only sets the row delay. */
  columns?: number;
  as?: "ul" | "ol" | "div";
  className?: string;
  children: React.ReactNode;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const activate = useCallback((index: number) => setActiveIndex(index), []);
  const value = useMemo(
    () => ({ activate, activeIndex, columns }),
    [activate, activeIndex, columns],
  );

  return (
    <StageContext.Provider value={value}>
      <StageBackdrop images={images} activeIndex={activeIndex} />
      <Tag className={className}>{children}</Tag>
    </StageContext.Provider>
  );
}

/**
 * Every image is mounted and cross-faded by opacity rather than swapped, so
 * there is no decode flash on the change. They are `next/image` with `fill`, so
 * each is served at the band's width and in AVIF or WebP where the browser
 * takes it.
 *
 * The whole layer carries the blend and the tint, not the individual pictures:
 * an element with `mix-blend-mode` composites its finished result into the
 * parent, so grouping them means the cross-fade happens normally *inside* the
 * layer and only the result is multiplied down onto the band. Putting the blend
 * on each image instead would isolate them and blend each against nothing.
 *
 * The slow drift on the active image is the one piece of motion here that is
 * not triggered — it is what stops a still photograph at 16% from reading as a
 * texture rather than as a picture.
 */
function StageBackdrop({
  images,
  activeIndex,
}: {
  images: readonly StageImage[];
  activeIndex: number;
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-(--stage-tint) mix-blend-multiply"
    >
      {images.map((image, index) => (
        <Image
          key={image.src}
          src={image.src}
          alt=""
          fill
          sizes="100vw"
          // Decorative and below the fold on every band that uses it.
          loading="lazy"
          className={`object-cover transition-[opacity,transform] duration-1000 ease-(--ease-out-expo) ${
            index === activeIndex ? "scale-100 opacity-100" : "scale-105 opacity-0"
          }`}
        />
      ))}
    </div>
  );
}

/**
 * One card. Renders its children as-is and adds the entrance, the reading-line
 * trigger, and a `revealed` flag its `<Typewriter>` children can play off.
 *
 * `data-active` is exposed on the element so a section can style the card whose
 * picture is currently up without any of this needing to know what that looks
 * like.
 */
export function RevealCard({
  index,
  as: Tag = "li",
  className = "",
  children,
  ...rest
}: {
  index: number;
  as?: "li" | "div" | "article";
  className?: string;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "children" | "className">) {
  const { activate, activeIndex, columns } = useStage();
  const prefersReducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    // No entrance to run: the card is already where it belongs and the
    // typewriter never splits. The backdrop still follows the reading line,
    // because a cross-fade at this speed is not the motion the preference is
    // about — but it is the only thing left moving.
    if (prefersReducedMotion) {
      setRevealed(true);
      const trigger = ScrollTrigger.create({
        trigger: element,
        start: "top 70%",
        end: "bottom 40%",
        onToggle: (self) => {
          if (self.isActive) activate(index);
        },
      });
      return () => trigger.kill();
    }

    const context = gsap.context(() => {
      gsap.set(element, { autoAlpha: 0, y: 32 });

      let entered = false;
      const enter = () => {
        if (entered) return;
        entered = true;

        gsap.to(element, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          // Position in the row, so a row resolves left to right instead of
          // all at once. `columns` is the widest-breakpoint count; on a
          // narrower grid the modulo simply produces a smaller offset.
          delay: (index % columns) * 0.12,
          onStart: () => setRevealed(true),
        });
      };

      ScrollTrigger.create({ trigger: element, start: "top 88%", once: true, onEnter: enter });

      // The card was hidden a few lines up, so nothing is allowed to leave it
      // that way. Anything already above the trigger line when the page loads —
      // a deep link to `#quote`, a browser restoring a scroll position, a
      // refresh part-way down — is revealed here rather than waiting for a
      // scroll event that may never come. `enter` is idempotent, so a trigger
      // that also fires on its own refresh costs nothing.
      if (element.getBoundingClientRect().top < window.innerHeight * 0.88) enter();

      ScrollTrigger.create({
        trigger: element,
        start: "top 70%",
        end: "bottom 40%",
        onToggle: (self) => {
          if (self.isActive) activate(index);
        },
      });
    }, element);

    return () => context.revert();
  }, [prefersReducedMotion, index, columns, activate]);

  return (
    <Tag
      // One generic ref for three possible tags; the union is wider than any
      // single one of them, which is all this cast is saying.
      ref={ref as React.Ref<never>}
      data-active={index === activeIndex ? "true" : undefined}
      className={className}
      {...rest}
    >
      <RevealContext.Provider value={revealed}>{children}</RevealContext.Provider>
    </Tag>
  );
}
