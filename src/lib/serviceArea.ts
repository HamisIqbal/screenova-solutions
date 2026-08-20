/**
 * Where Screenova will actually drive, expressed as ZIP codes.
 *
 * The quote form asks for a ZIP and answers on the spot, which means the
 * service area has to exist as data rather than as the prose in
 * `serviceArea.cities`. This file is that data, and it is the only place the
 * boundary is written down — `isServedZip` is the one way to ask.
 *
 * It is stored as inclusive numeric ranges, not a list of every ZIP. A county's
 * codes are largely contiguous, so ranges are a twentieth of the length, they
 * survive the Post Office adding a code inside a block, and a human can read
 * the boundary off them. The trade is that a range can include a ZIP that does
 * not exist or is not really served; each block below is annotated with the
 * places it is meant to cover so an over-reach is visible rather than buried.
 *
 * ---------------------------------------------------------------------------
 * These ranges were derived from the cities listed in `serviceArea.cities` —
 * the four Tampa Bay counties those cities sit in. They are a starting boundary
 * and not a survey: confirm them against where the vans really go, then edit
 * here. Nothing else in the codebase needs to change.
 *
 * A ZIP outside these ranges is not a rejection — the form's out-of-area
 * dialogue invites the caller to phone, because "just outside the line" is a
 * judgement call and a person should make it, not this table.
 */
type ZipRange = readonly [first: number, last: number];

const SERVED_RANGES: readonly ZipRange[] = [
  // Hillsborough — Brandon, Dover, Gibsonton, Lithia and FishHawk, Lutz,
  // Odessa, Plant City, Riverview, Ruskin, Sun City Center, Apollo Beach,
  // Seffner, Thonotosassa, Valrico, Wimauma.
  [33510, 33511],
  [33527, 33527],
  [33534, 33534],
  [33547, 33547],
  [33548, 33549],
  [33556, 33556],
  [33558, 33559],
  [33563, 33567],
  [33569, 33569],
  [33570, 33573],
  [33578, 33579],
  [33584, 33584],
  [33592, 33592],
  [33594, 33596],
  [33598, 33598],
  // Hillsborough — the city of Tampa itself, including Temple Terrace and
  // New Tampa.
  [33602, 33626],
  [33629, 33629],
  [33634, 33635],
  [33637, 33637],
  [33647, 33647],
  // Pasco — Wesley Chapel and Zephyrhills.
  [33540, 33545],
  // Pinellas — St. Petersburg and the beaches.
  [33701, 33716],
  [33770, 33786],
  // Pinellas — Clearwater, Largo, Pinellas Park, Seminole.
  [33755, 33764],
  [33765, 33767],
  // Pasco — Land O' Lakes, New Port Richey, Hudson, Trinity, Holiday.
  [34610, 34610],
  [34637, 34639],
  [34652, 34656],
  [34667, 34669],
  // Pinellas — Oldsmar through Dunedin, taking in Palm Harbor, Safety Harbor
  // and Tarpon Springs.
  [34677, 34698],
  // Manatee — Bradenton, Lakewood Ranch, Palmetto, Ellenton, Parrish.
  [34201, 34212],
  [34219, 34222],
];

/** A US ZIP is five digits. Anything else is a typo, not an address. */
export const ZIP_PATTERN = "\\d{5}";

/**
 * Is this ZIP inside the service area?
 *
 * Takes the raw field value, so it does its own tidying: a ZIP+4 is truncated
 * to its first five digits and surrounding space is ignored. Anything that is
 * not five digits is not served — the form has already refused to submit in
 * that case, so this is the second line, not the first.
 */
export function isServedZip(value: string): boolean {
  const digits = value.trim().replace(/\D/g, "").slice(0, 5);
  if (digits.length !== 5) return false;

  const zip = Number(digits);
  return SERVED_RANGES.some(([first, last]) => zip >= first && zip <= last);
}
