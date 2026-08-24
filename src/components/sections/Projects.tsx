import Image from "next/image";
import { CtaLink, Section, SectionHeader } from "@/components/ui";
import { projects } from "@/content/home";

/**
 * Our Projects — the section the nav has been linking to for some time without
 * one existing. `#projects` now resolves.
 *
 * ---------------------------------------------------------------------------
 * Four categories, each naming a real kind of job — a torn screen replaced, a
 * bent frame rebuilt, a pet-damaged slider re-meshed in heavier material, a
 * whole house done in one visit.
 *
 * The photographs in them are stand-ins, and the section says so in its own
 * intro line rather than leaving the reader to assume otherwise: a stock
 * photograph presented as Screenova's own work on a page headed "Our Projects"
 * is a lie whatever the caption says, so the copy names them as placeholders
 * and describes what they are — the kind of work each pair is about, not the
 * jobs themselves. Swap in real project photography and that line goes with it;
 * both are in `content/home.ts` and neither is in this file.
 *
 * Each category is a before/after pair: give it `before` and `after` and the
 * block renders as two pictures with an arrow between them. Take them away and
 * the same block renders as two labelled panels — the same shape, the same
 * proportions, the same page — carrying the word "Before" and "After" and
 * nothing else.
 *
 * A category needs *both* halves to render as pictures. A "before" with no
 * "after" is a photograph of a broken screen, which is not a project.
 *
 * ---------------------------------------------------------------------------
 * Two up from `sm`, one up below it. The pair inside each card is always side
 * by side, at every width — a before and an after stacked vertically reads as
 * two separate pictures rather than as one comparison, and the comparison is
 * the entire point of the section.
 */
export function Projects() {
  return (
    <Section id="projects" ground="paper" labelledBy="projects-title">
      <SectionHeader title={projects.title} titleId="projects-title" intro={projects.intro} />

      <ul className="grid gap-6 sm:grid-cols-2">
        {projects.categories.map((category) => {
          const hasPair = Boolean(category.before && category.after);

          return (
            <li
              key={category.id}
              className="overflow-hidden rounded-2xl border border-(--raised-border)"
            >
              <div className="grid grid-cols-2">
                <Half label="Before" photo={category.before} paired={hasPair} />
                <Half label="After" photo={category.after} paired={hasPair} />
              </div>

              <div className="px-5 py-5">
                <h3 className="text-lg leading-snug font-bold">{category.title}</h3>
                <p className="mt-2 text-(--on-ground-muted)">{category.body}</p>

                {!hasPair && (
                  <p
                    className="mt-3 text-(--on-ground-muted)"
                    style={{ fontSize: "var(--text-label)" }}
                  >
                    {projects.pending}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-[clamp(3rem,8vw,6rem)] flex justify-center">
        <CtaLink href="#quote">{projects.cta}</CtaLink>
      </div>
    </Section>
  );
}

/**
 * One half of a pair: the photograph if there is one, the labelled panel if
 * there is not.
 *
 * `paired` rather than deriving it from `photo` alone, so a half-filled
 * category renders as two placeholders instead of one picture and one empty
 * box — see the note above.
 *
 * The label sits on the picture as well as on the placeholder. On the
 * placeholder it is the whole content; on the photograph it is what tells you
 * which of the two you are looking at, and it keeps its own dark wash so it
 * reads over any image that lands there.
 */
function Half({
  label,
  photo,
  paired,
}: {
  label: string;
  photo?: { src: string; alt: string };
  paired: boolean;
}) {
  const showPhoto = paired && photo;

  return (
    <div className="relative aspect-4/3 bg-(--raised)">
      {showPhoto ? (
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(min-width: 40rem) 22rem, 50vw"
          className="object-cover"
        />
      ) : (
        // The empty state. A hairline cross-hatch of the page's own rule colour
        // at low strength — enough that the panel is visibly a reserved space
        // rather than a broken image, and quiet enough that it is not competing
        // with anything on the band.
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, var(--raised-border) 0 1px, transparent 1px 10px)",
          }}
        />
      )}

      <span
        className="font-title absolute bottom-2 left-2 rounded-full bg-black/65 px-2.5 py-1 text-(--color-paper)"
        style={{ fontSize: "var(--text-label)", fontWeight: 500, letterSpacing: "0.08em" }}
      >
        {label}
      </span>
    </div>
  );
}
