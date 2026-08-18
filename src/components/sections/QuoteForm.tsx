import { Section, SectionHeader } from "@/components/ui";
import { quote } from "@/content/home";
import { contact } from "@/lib/site";

/**
 * The quote request, rebuilt as one short card.
 *
 * The old form asked for eight fields down a single column beside a left rail,
 * ran the seven services as a wrapping row of chips, and stood about nine
 * hundred pixels tall — a wall of work at the very point the page is asking for
 * a favour. Length is the thing that stops a form being filled in, so this one
 * is built around a single question: what is the least we can ask for and still
 * be able to answer?
 *
 * Four answers, and that is the whole visible form:
 *
 *   name + phone      who you are and how we reach you
 *   email + address   where the quote goes and where the screens are
 *   service           one select, not seven chips — a list that long is a
 *                     wrapping block three rows deep, and it is one choice
 *   details           three rows, free text, the part that actually varies
 *
 * Everything else — how many, rough sizes, photographs — is real information
 * but almost nobody has it to hand, so it sits in a closed `<details>` under
 * the fields. Shut, it is one line; open, it is the rest of the old form. The
 * cost of the fields people skip is now one line of height instead of three
 * hundred pixels, and nothing was removed to get there.
 *
 * The phone number sits beside the button because a form is not the only way to
 * ask, and the person least likely to finish this is the one most likely to
 * call.
 *
 * The band is blue and the card is white: filling fields in is the most
 * demanding thing anyone does on this page, so the work happens on paper. The
 * card re-declares the white ground, which brings back the muted label colour,
 * the mist fields and the green submit button the blue band would otherwise
 * have taken away.
 *
 * Markup only — no submission handling is wired up yet.
 */

/**
 * Label, field, and the gap between them — one cell of the grid. A `div` and
 * not a `p`: paragraphs carry the page's 62ch measure, which is right for copy
 * and wrong for a field that is supposed to fill its column.
 */
function Field({
  id,
  label,
  className = "",
  children,
}: {
  id: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block" htmlFor={id}>
        {label}
      </label>
      {children}
    </div>
  );
}

const FIELD = "w-full";

export function QuoteForm() {
  return (
    <Section id="quote" ground="blue" labelledBy="quote-title">
      <SectionHeader
        eyebrow={quote.eyebrow}
        title={quote.title}
        titleId="quote-title"
        intro={quote.intro[0]}
      />

      <form
        aria-labelledby="quote-form-title"
        data-ground="paper"
        className="mx-auto max-w-3xl rounded-[2rem] p-6 sm:p-8 lg:p-10"
      >
        <h3 id="quote-form-title" className="sr-only">
          {quote.formTitle}
        </h3>

        {/* Two across from `sm` and never more: four short fields in two rows
            is the whole shape of the thing, and a third column would make the
            fields too narrow to read what you had typed. */}
        <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
          <Field id="name" label={quote.fields.name}>
            <input className={FIELD} id="name" name="name" type="text" autoComplete="name" />
          </Field>

          <Field id="phone" label={quote.fields.phone}>
            <input className={FIELD} id="phone" name="phone" type="tel" autoComplete="tel" />
          </Field>

          <Field id="email" label={quote.fields.email}>
            <input className={FIELD} id="email" name="email" type="email" autoComplete="email" />
          </Field>

          <Field id="address" label={quote.fields.address}>
            <input
              className={FIELD}
              id="address"
              name="address"
              type="text"
              autoComplete="street-address"
            />
          </Field>

          {/* A select, not the old chip row. Seven chips wrapped to three lines
              and read as filters; this is one choice out of a known list, which
              is what a select is for — and it is one line tall. */}
          <Field id="service" label={quote.fields.service} className="sm:col-span-2">
            <select className={FIELD} id="service" name="service" defaultValue="">
              <option value="" disabled>
                Select a service
              </option>
              {quote.serviceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>

          <Field id="details" label={quote.fields.details} className="sm:col-span-2">
            <textarea className={FIELD} id="details" name="details" rows={3} />
          </Field>
        </div>

        {/* The three fields most people leave empty, folded away. Native
            <details>: keyboard operable, announced as a disclosure, and it
            works with scripts off — the same reason the FAQ is built this way. */}
        <details className="group mt-5 border-t border-(--raised-border) pt-4">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-(--on-ground-muted)">
            <span
              aria-hidden="true"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-(--raised-border) leading-none transition-transform duration-300 group-open:rotate-45"
            >
              +
            </span>
            <span style={{ fontSize: "var(--text-label)" }}>{quote.optional}</span>
          </summary>

          <div className="mt-4 grid gap-x-5 gap-y-4 sm:grid-cols-2">
            <Field id="quantity" label={quote.fields.quantity}>
              <input className={FIELD} id="quantity" name="quantity" type="number" min="1" />
            </Field>

            <Field id="measurements" label={quote.fields.measurements}>
              <input className={FIELD} id="measurements" name="measurements" type="text" />
            </Field>

            <Field id="photos" label={quote.fields.photos} className="sm:col-span-2">
              <input
                className={FIELD}
                id="photos"
                name="photos"
                type="file"
                accept="image/*"
                multiple
              />
            </Field>
          </div>
        </details>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <button type="submit">{quote.submit}</button>

          <p className="text-(--on-ground-muted)" style={{ fontSize: "var(--text-label)" }}>
            {quote.callInstead}{" "}
            <a href={contact.phone.href} className="whitespace-nowrap">
              {contact.phone.label}
            </a>
          </p>
        </div>
      </form>
    </Section>
  );
}
