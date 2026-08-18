/**
 * The opening block every section shares: an eyebrow, the title, and optional
 * intro copy, all ranged left. Keeping it in one place is what makes nine
 * different layouts read as one page.
 *
 * There is no `tone` prop. The header takes its colours from whatever band it
 * is standing in, so a section can change ground without the header being told
 * about it.
 *
 * The eyebrow used to carry a small dot in the band's rule colour. It is gone:
 * the titles are now set considerably larger and at 700, and a 6px bullet in
 * front of a 52px heading reads as leftover furniture rather than as structure.
 * The eyebrow's own tracking and size already separate it from the title.
 *
 * `text-left` is stated rather than inherited. The measure this sits in is
 * centred on the page, and an explicit alignment is what guarantees the header
 * is not centred with it if a parent ever picks up `text-center`.
 */
export function SectionHeader({
  eyebrow,
  title,
  titleId,
  intro,
  className = "",
}: {
  eyebrow: string;
  title: string;
  titleId: string;
  intro?: string | readonly string[];
  className?: string;
}) {
  const paragraphs = typeof intro === "string" ? [intro] : (intro ?? []);

  return (
    // Wider than it was: the title is a larger setting now, and 2xl would have
    // pushed most of them onto an extra line for no reason.
    <header className={`max-w-3xl text-left ${className}`}>
      <p
        className="font-title text-(--on-ground-muted)"
        style={{ fontSize: "var(--text-label)", fontWeight: 400, letterSpacing: "0.16em" }}
      >
        {eyebrow.toUpperCase()}
      </p>

      <h2 id={titleId} className="mt-3">
        {title}
      </h2>

      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="mt-5 text-(--on-ground-muted)">
          {paragraph}
        </p>
      ))}
    </header>
  );
}
