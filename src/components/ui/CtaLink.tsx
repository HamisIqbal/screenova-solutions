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
 */
export function CtaLink({
  href,
  children,
  className = "",
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`font-title inline-flex shrink-0 items-center rounded-full bg-(--action) px-6 py-3 whitespace-nowrap text-(--on-action) no-underline transition-colors hover:bg-(--action-hover) ${className}`}
      // Medium, the one thing on the page above Regular other than the h1. A
      // filled pill at 14px in Regular reads as a label someone happened to put
      // a background behind; half a step of weight is what makes it a control.
      style={{ fontSize: "var(--text-body)", fontWeight: 500 }}
    >
      {children}
    </a>
  );
}
