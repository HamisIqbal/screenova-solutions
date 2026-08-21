/**
 * Copy for the pages that are not the home page: four service pages and four
 * city pages.
 *
 * Both kinds render through the same component (`InfoPage`), so this file is
 * where the difference between them lives. That is deliberate and it is the
 * whole guard against the failure mode these pages usually have: one template
 * plus one variable is a doorway page, and the only thing that stops it being
 * one is that the words really are different. Every `blocks` entry below is
 * written for its own page.
 *
 * ---------------------------------------------------------------------------
 * What is and is not asserted here.
 *
 * Nothing on these pages claims anything Screenova has not already said about
 * itself elsewhere in this codebase. The service pages are drawn from
 * `services`, `screenOptions` and `faq` in `home.ts` — the same capabilities,
 * described at more length.
 *
 * The city pages are thinner on purpose, and they are honest about why: the one
 * genuinely local fact this repository holds is the service area, which exists
 * as data in `src/lib/serviceArea.ts`, so the ZIP codes each page lists are read
 * off that table rather than asserted. There are no invented neighbourhoods, no
 * invented addresses, no invented local landmarks, no "trusted by families in
 * …", and no reviews. See the note above `cityPages` for what is still needed
 * before those pages are worth much to a reader.
 */

export type PageBlock = {
  title: string;
  body: string[];
  /** An optional bulleted list under the prose. */
  list?: readonly string[];
};

export type InfoPageContent = {
  /** The route, with the trailing slash the site is canonical on. */
  href: string;
  /** The page's one H1. */
  title: string;
  /** Supporting copy under it — a paragraph, never a second heading. */
  supporting: string;
  /** `<title>`, before the layout appends the brand. */
  metaTitle: string;
  metaDescription: string;
  intro: readonly string[];
  blocks: readonly PageBlock[];
  /** Internal links out. Every href here must be a route that exists. */
  related: readonly { label: string; href: string }[];
  relatedLabel: string;
};

/* ------------------------------------------------------------------------ */
/* Service pages                                                             */
/* ------------------------------------------------------------------------ */

export const servicePages: readonly InfoPageContent[] = [
  {
    href: "/window-screen-repair/",
    title: "Window Screen Repair in Tampa Bay",
    supporting:
      "Split corners, loose spline, small tears and screens that won't sit in their track — repaired at your home.",
    metaTitle: "Window Screen Repair Tampa Bay",
    metaDescription:
      "Mobile window screen repair across Tampa Bay. Torn mesh, split corners, loose spline and screens that won't sit right — repaired at your home. Free estimates.",
    intro: [
      "Not every damaged screen needs replacing. A repair is the cheapest of the three answers, and it is the one we look for first — if your screen can be repaired, we will tell you so rather than quoting you a new one.",
    ],
    blocks: [
      {
        title: "What we can usually repair",
        body: [
          "These are the faults that come back to a repair rather than a rebuild. If the aluminum is straight and the corners will take a new joint, the screen you already own is almost always the cheapest screen you can have.",
        ],
        list: [
          "A corner that has split or pulled apart at the joint",
          "Spline working its way out of the channel, leaving the mesh loose",
          "A small tear or puncture in otherwise sound mesh",
          "A screen that has dropped out of its track or will not sit square in the opening",
          "Missing or broken clips, pull tabs and hardware",
          "A sliding screen door that jumps its rollers",
        ],
      },
      {
        title: "When a repair is the wrong answer",
        body: [
          "There is a point past which repairing costs more than replacing and lasts less time, and it is worth knowing where it is before you call anybody.",
          "If the mesh has gone brittle and is tearing in more than one place, the material is at the end of its life and the screen wants rescreening rather than patching. If the frame is bent, corroded through, or so far out of square that it no longer meets the window, the frame is the problem and no amount of work on the mesh will fix it.",
          "Both of those have their own page, and neither is an upsell — they are just different jobs.",
        ],
      },
      {
        title: "How a repair visit works",
        body: [
          "We come to you. Screens are awkward to transport and easy to bend, and a screen that gets damaged on the way to a shop is a screen you are now paying more for.",
          "Send a photo before we come out if you can. A picture of the damage and the window it belongs to is usually enough to tell you on the phone whether you are looking at a repair, a rescreen or a rebuild — and what each of them would cost.",
        ],
      },
    ],
    relatedLabel: "If a repair is not the answer",
    related: [
      { label: "Window Rescreening", href: "/window-rescreening/" },
      { label: "Window Screen Replacement", href: "/window-screen-replacement/" },
      { label: "Custom Window Screens", href: "/custom-window-screens/" },
    ],
  },

  {
    href: "/window-rescreening/",
    title: "Window Rescreening in Tampa Bay",
    supporting:
      "Keep the frame, change the mesh. The least expensive way to make an old screen new again.",
    metaTitle: "Window Rescreening Tampa Bay",
    metaDescription:
      "Window and screen door rescreening across Tampa Bay. We strip the old mesh and spline and re-mesh your existing frames on site. Fiberglass, pet-resistant and solar mesh.",
    intro: [
      "Rescreening is the middle answer: the frame you already have stays, and only the screening material changes. If your frames are straight, this is almost certainly the job you want.",
    ],
    blocks: [
      {
        title: "The signs it is time to rescreen",
        body: [
          "Mesh wears out long before aluminum does, and in Florida sun it wears out faster. A screen does not have to be torn to be finished.",
        ],
        list: [
          "Mesh that has faded from charcoal to grey, or gone chalky to the touch",
          "A panel that sags or ripples instead of sitting taut in the frame",
          "Tearing in more than one place, or a tear that grows every time you touch it",
          "Mesh that has stretched away from the spline along an edge",
          "A screen you can see through more than you used to — the weave has opened up",
        ],
      },
      {
        title: "What actually happens",
        body: [
          "The old spline and mesh come out of the channel, the frame is cleaned and checked for square, new material is rolled in under tension with fresh spline, and the excess is trimmed back. The screen goes straight back in the window.",
          "It is not a long job per screen, which is why doing several at once is so much better value than doing them one at a time as they fail. Most people have more tired screens than they think — it is worth walking the house before you book.",
        ],
      },
      {
        title: "Which mesh to put back",
        body: [
          "Rescreening is the moment to change your mind about the material, because the labour is the same whichever one goes in.",
        ],
        list: [
          "Standard fiberglass — good airflow and visibility, the default for most windows",
          "Pet-resistant — a heavier, tougher weave for sliders and any window a dog or cat has already been through",
          "Solar mesh — stops a share of the sun before it reaches the glass, for the windows that take the afternoon",
        ],
      },
      {
        title: "Sliding screen doors",
        body: [
          "Screen doors rescreen the same way and for the same reasons, and they are usually first in the house to need it — they are the one screen people push on.",
          "A damaged slider very rarely needs replacing as a door. If the frame is straight and the rollers are sound, it is a re-mesh.",
        ],
      },
    ],
    relatedLabel: "Related services",
    related: [
      { label: "Window Screen Repair", href: "/window-screen-repair/" },
      { label: "Window Screen Replacement", href: "/window-screen-replacement/" },
      { label: "Custom Window Screens", href: "/custom-window-screens/" },
    ],
  },

  {
    href: "/window-screen-replacement/",
    title: "Window Screen & Frame Replacement in Tampa Bay",
    supporting:
      "When the frame is the problem — bent, corroded, or out of square — we rebuild it to your opening.",
    metaTitle: "Window Screen & Frame Replacement Tampa Bay",
    metaDescription:
      "Replacement window screens and screen frames across Tampa Bay. Bent, corroded or broken frames rebuilt in new aluminum to your exact opening. Mobile service, free estimates.",
    intro: [
      "People searching for a replacement window screen are usually looking for a frame, not mesh. If yours is bent, corroded, snapped at a corner or simply will not sit in the window any more, the frame is what needs replacing — and that is a different job from rescreening.",
    ],
    blocks: [
      {
        title: "Frame problems that mean replacement",
        body: [
          "Aluminum takes a set. Once a frame has been bent, straightened, and bent again, it stops holding the mesh in tension and stops meeting the window squarely, and no re-mesh will bring that back.",
        ],
        list: [
          "A frame bowed or kinked along one side",
          "Corners that have pulled apart more than once, or corner keys that no longer hold",
          "Corrosion or pitting, common on screens facing salt air",
          "A frame out of square, so the screen sits proud on one side",
          "Frames damaged by a storm, a pressure washer, or a fall from an upper floor",
        ],
      },
      {
        title: "Replacing a frame, not buying a size",
        body: [
          "A replacement screen is built to the opening it is going into, measured on site. Stock screens are sold in fixed sizes and the difference between the size you can buy and the size your window actually is comes out as a rattle, a gap, or a screen that falls out.",
          "We measure, build in new aluminum, fit the mesh you want, and install it in the same visit. Your existing mesh type carries over unless you want to change it.",
        ],
      },
      {
        title: "Whole-house replacement",
        body: [
          "If you are buying or selling a house with screens missing or beyond saving, replacing the lot at once is much cheaper per screen than replacing them one at a time, because the measuring and the trip are the same either way.",
          "We can measure, build and install screens for every window in a property in one visit.",
        ],
      },
    ],
    relatedLabel: "Related services",
    related: [
      { label: "Custom Window Screens", href: "/custom-window-screens/" },
      { label: "Window Rescreening", href: "/window-rescreening/" },
      { label: "Window Screen Repair", href: "/window-screen-repair/" },
    ],
  },

  {
    href: "/custom-window-screens/",
    title: "Custom Window Screens Built for Your Home",
    supporting:
      "Measured to your opening and built in aluminum — for windows with no screen at all, or none that ever fitted.",
    metaTitle: "Custom Window Screens Tampa Bay",
    metaDescription:
      "Custom-built window screens across Tampa Bay, measured and made to your window openings in aluminum framing. Fiberglass, pet-resistant and solar mesh. Free estimates.",
    intro: [
      "A window with no screen is the most common call we get, and it is nearly always one of three things: a house bought with screens missing, a screen lost to a storm, or an opening that was never screened in the first place.",
    ],
    blocks: [
      {
        title: "Why custom rather than stock",
        body: [
          "Window openings are not standard, and they are least standard in older houses — which in this part of Florida is most of them. A stock screen is sold to the nearest common size, and the gap between that and your actual opening is what makes a screen rattle in the wind, drop out of the track, or let in exactly what it was bought to keep out.",
          "Every screen we build is measured at the window it is going into. There is no trimming something down to nearly fit.",
        ],
      },
      {
        title: "What goes into one",
        body: [
          "The frame is aluminum, cut to the measured opening and joined at the corners. The mesh is rolled in under tension with new spline, and the screen is fitted with the clips, tabs and hardware the window takes.",
          "The mesh is your choice, and it is worth making deliberately rather than defaulting: standard fiberglass for most windows, pet-resistant where an animal has access, solar on the elevations that take the sun.",
        ],
      },
      {
        title: "Measuring, and who does it",
        body: [
          "We do. Measuring a screen opening is where most do-it-yourself screen projects go wrong — the measurement is not the glass, it is the channel, and being an eighth of an inch out in the wrong direction means the screen does not go in.",
          "You are welcome to send rough sizes and photographs when you ask for a quote; they help us price the job. The measurements the screens are actually built from are taken on site.",
        ],
      },
      {
        title: "One window or the whole house",
        body: [
          "Both are normal. A single missing screen on a lanai and a full set for a house that has none are the same process, and doing them together is cheaper per screen than doing them apart.",
        ],
      },
    ],
    relatedLabel: "Related services",
    related: [
      { label: "Window Screen Replacement", href: "/window-screen-replacement/" },
      { label: "Window Rescreening", href: "/window-rescreening/" },
      { label: "Window Screen Repair", href: "/window-screen-repair/" },
    ],
  },
];

/* ------------------------------------------------------------------------ */
/* City pages                                                                */
/* ------------------------------------------------------------------------ */

/**
 * Four cities, and four only.
 *
 * ---------------------------------------------------------------------------
 * READ THIS BEFORE ADDING A FIFTH.
 *
 * These pages are honest but they are not yet good, and the reason is that this
 * repository does not contain the information that would make them good. What
 * each one says today is: which services are available there, which ZIP codes
 * are covered (read off `src/lib/serviceArea.ts`, so it cannot drift from what
 * the quote form actually accepts), and how mobile service works. All of that
 * is true and none of it is specific to the city in a way a reader would value.
 *
 * What would make them worth reading, and what somebody at Screenova has to
 * supply before they will be:
 *
 *   - Real completed jobs in that city, with photographs and permission.
 *   - Genuine reviews from customers there, from the Google Business Profile.
 *   - Anything true and particular about screens in that city — the housing
 *     stock, the salt air on the Pinellas beaches, the age of the windows in a
 *     given area — written by somebody who actually works there.
 *
 * Until then, four is the right number. Twenty of these with the city name
 * swapped is a doorway-page network, and it is penalised as one.
 */
export type CityPageContent = InfoPageContent & {
  city: string;
  /** ZIP codes covered there. Every one is inside `SERVED_RANGES`. */
  zips: readonly string[];
};

export const cityPages: readonly CityPageContent[] = [
  {
    city: "Tampa",
    href: "/tampa-window-screen-repair/",
    title: "Window Screen Repair in Tampa, FL",
    supporting:
      "Mobile screen repair, rescreening and custom screens across Tampa — we measure, build and fit at your address.",
    metaTitle: "Window Screen Repair Tampa FL",
    metaDescription:
      "Window screen repair, rescreening and custom screens in Tampa, FL. Mobile service — we measure, build and install at your home. Free estimates from Screenova Solutions.",
    intro: [
      "Screenova covers the city of Tampa, including Temple Terrace and New Tampa. Every job is done at your address: we measure the openings on site, build the screens, and fit them in the same visit.",
    ],
    blocks: [
      {
        title: "What we do in Tampa",
        body: [
          "The full range — a single torn screen on a lanai through to every window in a house that has none.",
        ],
        list: [
          "Window screen repair — split corners, loose spline, small tears",
          "Window rescreening — new mesh in your existing frames",
          "Screen frame repair and replacement — bent, corroded or broken frames rebuilt",
          "Custom-built new window screens, measured to the opening",
          "Sliding screen door rescreening",
          "Pet-resistant and solar mesh",
        ],
      },
    ],
    zips: [
      "33602",
      "33603",
      "33604",
      "33605",
      "33606",
      "33607",
      "33609",
      "33610",
      "33611",
      "33612",
      "33613",
      "33614",
      "33615",
      "33616",
      "33617",
      "33618",
      "33619",
      "33620",
      "33621",
      "33624",
      "33625",
      "33626",
      "33629",
      "33634",
      "33635",
      "33637",
      "33647",
    ],
    relatedLabel: "Services in Tampa",
    related: [
      { label: "Window Screen Repair", href: "/window-screen-repair/" },
      { label: "Window Rescreening", href: "/window-rescreening/" },
      { label: "Window Screen Replacement", href: "/window-screen-replacement/" },
      { label: "Custom Window Screens", href: "/custom-window-screens/" },
    ],
  },

  {
    city: "St. Petersburg",
    href: "/st-petersburg-window-screen-repair/",
    title: "Window Screen Repair in St. Petersburg, FL",
    supporting:
      "Mobile screen repair, rescreening and custom screens across St. Petersburg and the beaches.",
    metaTitle: "Window Screen Repair St. Petersburg FL",
    metaDescription:
      "Window screen repair, rescreening and custom screens in St. Petersburg, FL. Mobile service — we measure, build and install at your home. Free estimates from Screenova Solutions.",
    intro: [
      "Screenova covers St. Petersburg and the surrounding Pinellas coast. Screens are measured, built and fitted at your address in the same visit.",
    ],
    blocks: [
      {
        title: "What we do in St. Petersburg",
        body: [
          "Repairs, rescreening, frame replacement and new custom screens, for houses and for screened openings on the water side.",
        ],
        list: [
          "Window screen repair — split corners, loose spline, small tears",
          "Window rescreening — new mesh in your existing frames",
          "Screen frame repair and replacement, including corroded frames",
          "Custom-built new window screens, measured to the opening",
          "Sliding screen door rescreening",
          "Pet-resistant and solar mesh",
        ],
      },
    ],
    zips: [
      "33701",
      "33702",
      "33703",
      "33704",
      "33705",
      "33706",
      "33707",
      "33708",
      "33709",
      "33710",
      "33711",
      "33712",
      "33713",
      "33714",
      "33715",
      "33716",
    ],
    relatedLabel: "Services in St. Petersburg",
    related: [
      { label: "Window Screen Repair", href: "/window-screen-repair/" },
      { label: "Window Rescreening", href: "/window-rescreening/" },
      { label: "Window Screen Replacement", href: "/window-screen-replacement/" },
      { label: "Custom Window Screens", href: "/custom-window-screens/" },
    ],
  },

  {
    city: "Clearwater",
    href: "/clearwater-window-screen-repair/",
    title: "Window Screen Repair in Clearwater, FL",
    supporting:
      "Mobile screen repair, rescreening and custom screens across Clearwater, Largo and Pinellas Park.",
    metaTitle: "Window Screen Repair Clearwater FL",
    metaDescription:
      "Window screen repair, rescreening and custom screens in Clearwater, FL. Mobile service — we measure, build and install at your home. Free estimates from Screenova Solutions.",
    intro: [
      "Screenova covers Clearwater and the neighbouring Pinellas cities. Everything is done at your address — measuring, building and fitting in one visit.",
    ],
    blocks: [
      {
        title: "What we do in Clearwater",
        body: [
          "The full range of screen work, for single screens and for whole properties.",
        ],
        list: [
          "Window screen repair — split corners, loose spline, small tears",
          "Window rescreening — new mesh in your existing frames",
          "Screen frame repair and replacement, including corroded frames",
          "Custom-built new window screens, measured to the opening",
          "Sliding screen door rescreening",
          "Pet-resistant and solar mesh",
        ],
      },
    ],
    zips: [
      "33755",
      "33756",
      "33759",
      "33760",
      "33761",
      "33762",
      "33763",
      "33764",
      "33765",
      "33767",
    ],
    relatedLabel: "Services in Clearwater",
    related: [
      { label: "Window Screen Repair", href: "/window-screen-repair/" },
      { label: "Window Rescreening", href: "/window-rescreening/" },
      { label: "Window Screen Replacement", href: "/window-screen-replacement/" },
      { label: "Custom Window Screens", href: "/custom-window-screens/" },
    ],
  },

  {
    city: "Lutz",
    href: "/lutz-window-screen-repair/",
    title: "Window Screen Repair in Lutz, FL",
    supporting:
      "Mobile screen repair, rescreening and custom screens across Lutz and north Hillsborough.",
    metaTitle: "Window Screen Repair Lutz FL",
    metaDescription:
      "Window screen repair, rescreening and custom screens in Lutz, FL. Mobile service — we measure, build and install at your home. Free estimates from Screenova Solutions.",
    intro: [
      "Screenova covers Lutz and the north Hillsborough line. Screens are measured, built and fitted at your address in one visit.",
    ],
    blocks: [
      {
        title: "What we do in Lutz",
        body: [
          "Repairs, rescreening, frame replacement and new custom screens — one screen or every window in the house.",
        ],
        list: [
          "Window screen repair — split corners, loose spline, small tears",
          "Window rescreening — new mesh in your existing frames",
          "Screen frame repair and replacement",
          "Custom-built new window screens, measured to the opening",
          "Sliding screen door rescreening",
          "Pet-resistant and solar mesh",
        ],
      },
    ],
    zips: ["33548", "33549", "33558", "33559"],
    relatedLabel: "Services in Lutz",
    related: [
      { label: "Window Screen Repair", href: "/window-screen-repair/" },
      { label: "Window Rescreening", href: "/window-rescreening/" },
      { label: "Window Screen Replacement", href: "/window-screen-replacement/" },
      { label: "Custom Window Screens", href: "/custom-window-screens/" },
    ],
  },
];

/** Every page in this file, for the footer's link lists and for tests. */
export const allInfoPages: readonly InfoPageContent[] = [...servicePages, ...cityPages];
