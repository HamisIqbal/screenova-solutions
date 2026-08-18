import Image from "next/image";
import { MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A list that opens into a photograph.
 *
 * Each row is a quiet 96px line of type until it is pointed at, at which point
 * it grows to 400px and the picture behind it fades up. The whole effect is one
 * hover on the row and four transitions hung off it — height, image opacity,
 * image scale, and the two pieces of type that move — so there is no state, no
 * effect, and nothing to hydrate. It is a server component.
 *
 * ---------------------------------------------------------------------------
 * Two things were changed from the stock version of this pattern, both for the
 * same reason: it has to sit on this site's bands rather than on a page that is
 * white in the day and near-black at night.
 *
 * Colour is taken from the ground roles — `--on-ground`, `--on-ground-muted`,
 * `--rule` — instead of the `neutral-200 / dark:neutral-800` pairs the pattern
 * ships with. This site has no dark mode; it has bands, and a component that
 * hard-codes neutrals is a component that only works on one of them. Reading
 * the roles means the same list is legible on paper, on blue, and on the black
 * chrome without a variant.
 *
 * The revealed state is the exception and is deliberately absolute: once the
 * photograph is up, the row is a dark image regardless of which band it sits
 * on, so the type goes to white and the icon inverts to white-on-black. Those
 * are the only two literal colours in the file, and they are answering the
 * picture, not the band.
 *
 * Below `md` the row never expands: a hover state is a promise you cannot keep
 * on a touchscreen, so the phone gets the type only, with the location moved
 * under the title where there is room for it.
 */

export interface CinematicItemProps {
  /** The row's number, shown as-is — "01", not 1. */
  id: string;
  title: string;
  /** The line on the right on desktop; slides under the title on phones. */
  location: string;
  src: string;
  alt: string;
  /** Optional target. Rows without one are type, not links. */
  href?: string;
}

function CinematicListItem({ id, title, location, src, alt, href }: CinematicItemProps) {
  const Row = href ? "a" : "div";

  return (
    <Row
      {...(href ? { href } : {})}
      className={cn(
        "group relative flex w-full flex-col justify-center overflow-hidden no-underline",
        "border-b border-(--rule)/25",
        // Fast start, slow settle — the row should feel like it is being
        // pulled open rather than easing into place.
        "transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
        // Phones get the collapsed row and keep it. Only pointer widths expand.
        "h-24 md:hover:h-[400px]",
        href && "cursor-pointer"
      )}
    >
      {/* The picture. It sits at 110% and settles to 100% over a full second
          while the opacity comes up in 700ms, so the image is still moving
          after it has finished arriving — that lag is the whole effect. */}
      <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 80rem) 72rem, 100vw"
          className="scale-110 object-cover transition-transform duration-1000 ease-out group-hover:scale-100"
        />
        {/* Weighted to the bottom, where the type sits. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      <div className="relative z-10 flex w-full items-center justify-between px-4 sm:px-8 md:px-12">
        <div className="flex items-center gap-6 md:gap-12">
          <span
            className="text-(--on-ground-muted)/70 tabular-nums transition-colors duration-500 group-hover:text-white/70"
            style={{ fontSize: "var(--text-label)" }}
          >
            {id}
          </span>

          <div className="flex flex-col">
            <h3
              className={cn(
                "font-title text-(--on-ground) text-2xl leading-none font-bold tracking-tight uppercase md:text-5xl",
                "transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
                // Lifts a little as the row opens, so the growth reads as the
                // picture arriving underneath rather than the type sliding down.
                "group-hover:-translate-y-2 group-hover:text-white"
              )}
            >
              {title}
            </h3>

            <span
              className="text-(--on-ground-muted) mt-1.5 block uppercase md:hidden"
              style={{ fontSize: "var(--text-label)", letterSpacing: "0.16em" }}
            >
              {location}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          {/* Desktop only, and only once the picture is there — it rises into
              the frame from 32px below as part of the same gesture. */}
          <span
            className="hidden translate-y-8 font-semibold text-transparent uppercase opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:text-white group-hover:opacity-100 md:block"
            style={{ fontSize: "var(--text-label)", letterSpacing: "0.16em" }}
          >
            {location}
          </span>

          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
              "border-(--rule)/40 text-(--on-ground-muted)/70",
              "group-hover:scale-110 group-hover:border-white group-hover:bg-white group-hover:text-black"
            )}
          >
            <MoveRight className="h-5 w-5 transition-transform duration-500 group-hover:-rotate-45" />
          </div>
        </div>
      </div>
    </Row>
  );
}

/**
 * The list itself. It renders nothing but rows and the two rules that close
 * them off — headings, padding and ground belong to whatever section drops it
 * in, so the same component can carry cities here and anything else later.
 */
export function CinematicList({
  items,
  className = "",
}: {
  items: readonly CinematicItemProps[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col border-t border-(--rule)/25", className)}>
      {items.map((item) => (
        <CinematicListItem key={item.id} {...item} />
      ))}
    </div>
  );
}
