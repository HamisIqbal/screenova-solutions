import Link from "next/link";

/**
 * The action pill. Every primary action on the page uses it — hero, section
 * closers, the nav — so the thing you're meant to click always looks the same
 * shape.
 *
 * Its colour is the band's, not its own: green on white, white on blue, white
 * on the black chrome. That isn't variety for its own sake, it's what survives
 * measurement — green is 1.82:1 against blue, so on each ground exactly one
 * choice reads as a button. The shape, the radius and the type never move, so
 * it is still one button.
 *
 * Because it reads `--action`, `--on-action` and `--action-hover` and names no
 * colour itself, any ancestor can re-point those three and change this pill
 * without a prop being added here. The hero does exactly that to go black; see
 * `Hero.tsx`.
 *
 * Two variants, and the second exists for one situation: a band with two things
 * to click. `outline` is the same pill drawn rather than filled — the ground's
 * own ink as a hairline, transparent inside, and it fills on hover to become
 * the solid one. Filling two pills side by side would make the reader choose
 * between two equal buttons; drawing the second is what says "and, if you would
 * rather, this". It borrows no new colour: the line and the lettering are
 * `--on-ground`, and the fill on hover is `--action`, so it follows the band
 * exactly as the solid one does.
 */
export function CtaLink({
  href,
  children,
  className = "",
  onClick,
  variant = "solid",
  ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "solid" | "outline";
  /** When the visible words are less specific than what the link does — the
      call pill says "Call Screenova Solutions" and announces the number. */
  ariaLabel?: string;
}) {
  const skin =
    variant === "solid"
      ? "bg-(--action) text-(--on-action) hover:bg-(--action-hover)"
      : "border border-(--on-ground)/45 text-(--on-ground) hover:border-(--action) hover:bg-(--action) hover:text-(--on-action)";

  const props = {
    onClick,
    "aria-label": ariaLabel,
    className: `font-title inline-flex shrink-0 items-center rounded-full px-6 py-3 whitespace-nowrap no-underline transition-colors ${skin} ${className}`,
    // Medium, the one thing on the page above Regular other than the h1. A
    // filled pill in Regular reads as a label someone happened to put a
    // background behind; half a step of weight is what makes it a control.
    style: { fontSize: "var(--text-body)", fontWeight: 500 },
  };

  // `tel:` and anything off-site stay plain anchors. A route on this site —
  // `/#quote` above all — is a `Link`, so leaving a city page for the form is
  // a client-side hop rather than a full reload. `scroll={false}` on a hash:
  // the router's own jump fires before the page below the fold has settled,
  // and `HashScroll` is what lands it on the section instead.
  if (href.startsWith("/")) {
    return (
      <Link href={href} scroll={href.includes("#") ? false : undefined} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
