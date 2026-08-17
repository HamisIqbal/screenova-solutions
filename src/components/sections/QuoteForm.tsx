import { Section, SectionHeader } from "@/components/ui";
import { quote } from "@/content/home";
import { slugify } from "@/lib/utils";

/**
 * The quote request. Header on the left rail, form in a card on the right, so
 * the ask and the work of answering it sit side by side.
 *
 * The band is blue and the form is a white card on it. Filling in eight fields
 * is the most demanding thing anyone does on this page, so the work happens on
 * paper — the card re-declares the white ground, which brings back the muted
 * label colour, the mist fields and the green submit button that the blue band
 * would otherwise have taken away.
 *
 * Service choice is a radio group styled as chips: the input stays a real
 * radio (screen-reader visible, keyboard operable) and `has-[:checked]` paints
 * the chip, so no JavaScript is involved in the selected state.
 *
 * Markup only — no submission handling is wired up yet.
 */

const fieldClass = "w-full";
const labelClass = "mb-1.5 block";

export function QuoteForm() {
  return (
    <Section id="quote" ground="blue" labelledBy="quote-title">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeader
          eyebrow={quote.eyebrow}
          title={quote.title}
          titleId="quote-title"
          intro={quote.intro}
        />

        <form
          aria-labelledby="quote-form-title"
          data-ground="paper"
          className="rounded-[2rem] p-6 md:p-8"
        >
          <h3 id="quote-form-title" className="sr-only">
            {quote.formTitle}
          </h3>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="name">
                {quote.fields.name}
              </label>
              <input className={fieldClass} id="name" name="name" type="text" autoComplete="name" />
            </div>

            <div>
              <label className={labelClass} htmlFor="phone">
                {quote.fields.phone}
              </label>
              <input className={fieldClass} id="phone" name="phone" type="tel" autoComplete="tel" />
            </div>

            <div>
              <label className={labelClass} htmlFor="email">
                {quote.fields.email}
              </label>
              <input
                className={fieldClass}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="address">
                {quote.fields.address}
              </label>
              <input
                className={fieldClass}
                id="address"
                name="address"
                type="text"
                autoComplete="street-address"
              />
            </div>
          </div>

          <fieldset className="mt-7">
            <legend className="mb-3">{quote.fields.service}</legend>
            <div className="flex flex-wrap gap-2">
              {quote.serviceOptions.map((option) => {
                const id = `service-${slugify(option)}`;
                return (
                  <label
                    key={option}
                    htmlFor={id}
                    // Chosen is the action colour — on this white card that is
                    // green, the same green as the submit button, so "picked"
                    // and "go" are visibly the same idea.
                    className="cursor-pointer rounded-full border border-(--raised-border) px-3.5 py-2 text-(--on-ground-muted) outline-offset-2 transition-colors has-[:checked]:border-(--action) has-[:checked]:bg-(--action) has-[:checked]:text-(--on-action) has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-(--focus-ring)"
                    style={{ fontSize: "var(--text-label)" }}
                  >
                    <input className="sr-only" type="radio" id={id} name="service" value={option} />
                    {option}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="quantity">
                {quote.fields.quantity}
              </label>
              <input className={fieldClass} id="quantity" name="quantity" type="number" min="1" />
            </div>

            <div>
              <label className={labelClass} htmlFor="measurements">
                {quote.fields.measurements}
              </label>
              <input className={fieldClass} id="measurements" name="measurements" type="text" />
            </div>
          </div>

          <div className="mt-5">
            <label className={labelClass} htmlFor="details">
              {quote.fields.details}
            </label>
            <textarea className={fieldClass} id="details" name="details" rows={4} />
          </div>

          <div className="mt-5">
            <label className={labelClass} htmlFor="photos">
              {quote.fields.photos}
            </label>
            <input
              className={fieldClass}
              id="photos"
              name="photos"
              type="file"
              accept="image/*"
              multiple
            />
          </div>

          <button type="submit" className="mt-7">
            {quote.submit}
          </button>
        </form>
      </div>
    </Section>
  );
}
