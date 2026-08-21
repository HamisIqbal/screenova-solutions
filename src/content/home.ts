/**
 * Source of truth for all copy on the page.
 *
 * Content lives here rather than inline in components so that when each section
 * gets its real design, the section component consumes this data and the copy
 * never has to be re-typed or kept in two places.
 */

export type ServiceItem = {
  id: string;
  title: string;
  body: string[];
  /** Placeholder until the real photograph lands — see the note on `services`. */
  image: string;
  imageAlt: string;
  cta?: string;
  /**
   * The dedicated page for this service, where one exists. Only four of the
   * seven have one — the rest are answered on this page and nowhere else, and
   * an href pointing at a route that does not exist is a broken link, so leave
   * it off rather than guessing.
   */
  href?: string;
};

export type Step = {
  number: number;
  title: string;
  body: string[];
};

export type Benefit = {
  title: string;
  body: string;
};

export type ScreenOption = {
  title: string;
  body: string;
  bestFor?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

/**
 * The headline is stored as explicit lines rather than one string, because the
 * break is a measured decision and the browser cannot be trusted to make it.
 *
 * Two lines, and the same two at every viewport — phone and desktop alike.
 * Line count and type size are one decision, not two: the widest line divided
 * into the column width *is* the ceiling, so asking for fewer lines is asking
 * for a smaller headline, not a bigger one. Two lines of Satoshi Black is the
 * most expensive setting this headline has had.
 *
 * Measured against Satoshi Black's real advance widths at -0.02em tracking,
 * summed from the font's own `hmtx` table:
 *
 *   Custom Window Screens &      12.72em
 *   Screen Repair in Tampa Bay   13.03em  ← the binding line
 *
 * This is the balanced split of the two available: breaking one word later, at
 * "…& Screen / Repair in Tampa Bay", runs 16.20em and would cost a fifth of the
 * type size. 13.03em is what `--text-hero`'s 44px ceiling is solved from, and
 * what the hero copy column being widened to 62% pays for.
 *
 * Re-measure and re-solve both together if the wording or the face changes.
 */
const heroTitleLines = ["Custom Window Screens &", "Screen Repair in Tampa Bay"] as const;

/**
 * The hero photograph — now the hero's floor rather than an object beside the
 * words. It fills the whole band and the copy sits on top of it.
 *
 * Interior, not exterior, and that is the right side of the product to show: an
 * exterior shot sells a house, this sells what the screens are actually for —
 * light and a view coming through a window you are standing inside of. Its
 * subject is a whole wall of them, which is also the widest read of the service.
 *
 * The room is bright and the windows are blown out, so it cannot carry type on
 * its own. See the scrim in `Hero.tsx`, which is measured against exactly that.
 *
 * Intrinsic size is recorded so `next/image` can reserve the box. The source is
 * 4288x2848 and about 12.8MB; the optimizer never serves it at that size, but
 * it is worth downsampling in the repo — nothing on the page needs past 2560px.
 */
export const heroImage = {
  src: "/images/trendy-modern-interior-living-room-with-blue-walls-white-windows-image-by-wirestock-on-magnific.jpg",
  width: 4288,
  height: 2848,
  alt: "A bright living room with pale blue walls, a wall of white-framed windows and a sliding screen door opening onto a balcony.",
} as const;

export const hero = {
  titleLines: heroTitleLines,
  title: heroTitleLines.join(" "),
  /**
   * The one line directly under the H1. It is supporting hero copy and not a
   * second heading — it renders as a `<p>`, deliberately, so the page keeps
   * exactly one H1. The em dash is the real character, not a hyphen.
   */
  supporting:
    "We Come to You — Mobile Window Screen Repair, Replacement & Installation Across Tampa Bay",
  /**
   * Under the supporting line: the problems people actually arrive with, in
   * their own words, before any claim about how we work. Short on purpose —
   * the hero now carries two buttons and a row of trust marks under it, and
   * both have to be on screen without scrolling.
   */
  body: "Torn mesh, missing screens or bent frames — we measure, build and fit at your door.",
  cta: "Get a Free Quote",
  callCta: "Call Now",
} as const;

/**
 * The six marks under the hero buttons.
 *
 * Every one of them is a statement about how the service works, not a claim
 * about how well it is rated: no counts, no star ratings, no years-in-business,
 * nothing that would need a source to stand up. If a genuine, verifiable badge
 * ever exists — a licence number, a review score from a real profile — it
 * belongs here, but it has to be real before it is written down.
 */
export const trustSignals = [
  "Local Tampa Bay Company",
  "Free Estimates",
  "Mobile Service — We Come to You",
  "Custom-Built Screens",
  "Quality Materials",
  "Professional Installation",
] as const;

/**
 * The six services, in the order the scrolling stage steps through them.
 *
 * `image` points at the photograph in `public/images/services/`. To swap one,
 * drop the new file in under the same name and rewrite `imageAlt` to describe
 * what is in it; nothing else changes.
 */
export const services = {
  eyebrow: "Window Screen Services",
  title: "Window Screen Repair & Replacement in Tampa Bay",
  intro:
    "One torn screen or every window in the house — we measure, build, repair and fit screens on site, at your home.",
  /**
   * The line under the service list, for the visitor who cannot tell rescreening
   * from repair from replacement — which is most of them. It points at the one
   * thing that settles it without a site visit, and the quote form's photo
   * upload is what makes it a real offer rather than a slogan.
   */
  help: "Not sure what you need? Send us a photo and we'll help you determine the best option.",
  /**
   * The whole-home line. It appears once, here, under the service list — the
   * job most worth telling people is possible, and the one people assume needs
   * several visits. Do not repeat it elsewhere on the page.
   */
  wholeHome:
    "Need screens for the entire house? We can measure, build and install custom screens for multiple windows in one visit.",
  items: [
    {
      id: "new-window-screens",
      href: "/custom-window-screens/",
      image: "/images/services/new-window-screens.png",
      imageAlt:
        "A newly built black-framed window screen leaning against a stucco wall beside the sliding window it was measured for.",
      title: "New Window Screens",
      body: [
        "Windows with no screen at all — a house you have just bought, one that blew off in a storm, or an opening that never had one.",
        "We measure the opening, build the screen to it in aluminum framing, and fit it. No stock sizes, nothing trimmed down to nearly fit.",
      ],
      cta: "Get a Quote",
    },
    {
      id: "window-rescreening",
      href: "/window-rescreening/",
      image: "/images/services/window-rescreening.png",
      imageAlt:
        "A technician rolling new mesh into the channel of a black window screen frame with a spline roller.",
      title: "Window Rescreening",
      body: [
        "Frame still straight, mesh torn, sagging or sun-faded? Then the frame stays and only the mesh changes.",
        "We strip the old mesh and spline, roll in new material, and re-fit the screen — the least expensive of the three answers, which is why we check for it first.",
      ],
      cta: "Get a Quote",
    },
    {
      id: "window-screen-repair",
      href: "/window-screen-repair/",
      image: "/images/services/window-screen-repair.png",
      imageAlt:
        "A technician cutting away torn mesh around a hole in a screen laid on a workbench, next to fresh spline, pliers, and a screwdriver.",
      title: "Window Screen Repair",
      body: [
        "A split corner, spline working its way out of the channel, a small tear, a screen that will not sit in its track.",
        "Most of those are a repair rather than a replacement. We look at what is actually wrong and tell you which one it is before any work starts.",
      ],
      cta: "Get a Quote",
    },
    {
      id: "sliding-screen-door-rescreening",
      image: "/images/services/sliding-screen-door-rescreening.png",
      imageAlt:
        "A technician rescreening a sliding screen door on a patio, rolling spline into the frame while holding the door steady.",
      title: "Sliding Screen Door Rescreening",
      body: [
        "The door everyone walks through, so it is the screen that goes first — pushed out at the bottom, torn at pet height, or blown through.",
        "A damaged slider rarely needs a whole new door. We re-mesh the one you have and put it back on its track.",
      ],
      cta: "Get a Quote",
    },
    {
      id: "pet-resistant-screens",
      image: "/images/services/pet-resistant-screens.png",
      imageAlt:
        "A dog and a cat sitting calmly behind a heavy pet-resistant screen in a sliding door.",
      title: "Pet-Resistant Screens",
      body: [
        "A dog that leans on the slider or a cat that climbs it goes straight through standard fiberglass — usually more than once.",
        "Pet-resistant mesh is a heavier, tougher weave built to take that. Available for windows and for sliding screen doors.",
      ],
    },
    {
      id: "solar-screens",
      image: "/images/services/solar-screens.png",
      imageAlt:
        "Two windows fitted with dark solar screens on a sunlit stucco wall, cutting the glare on the glass behind them.",
      title: "Solar Screens",
      body: [
        "For the windows that take the worst of it — a west-facing wall in the afternoon, or a room nobody can sit in by three o'clock.",
        "Solar mesh stops a share of the sun before it reaches the glass, cutting glare and heat while the window still breathes.",
      ],
    },
    {
      id: "screen-frame-repair",
      href: "/window-screen-replacement/",
      // Reuses the New Window Screens photograph: it is a bare aluminum frame
      // against a wall, which is as much this service as it is that one. Swap
      // it for its own picture when one exists.
      image: "/images/services/new-window-screens.png",
      imageAlt:
        "A black aluminum screen frame standing against a stucco wall, its corner joints and spline channel visible.",
      title: "Screen Frame Repair / Replacement",
      body: [
        "Bent or corroded frames, corners pulled apart, a screen gone out of square that no longer sits in the window.",
        "When the mesh is sound but the frame is not, the frame is what gets replaced — rebuilt to the same opening in new aluminum, with your mesh type carried over or upgraded.",
      ],
      cta: "Get a Quote",
    },
  ] satisfies ServiceItem[],
} as const;

export const howItWorks = {
  eyebrow: "How It Works",
  title: "Getting New Screens Is Simple",
  /**
   * The band's closing action. Deliberately not "Get a Free Quote" — every
   * section on the page having the same button is how a page stops being read
   * as sections. This one names the step the four cards above it just described
   * as the easy way in.
   */
  cta: "Send Us a Photo",
  steps: [
    {
      number: 1,
      title: "Tell Us What You Need",
      body: [
        "Contact Screenova Solutions and let us know how many screens you need and whether you're looking for new screens, rescreening, or repairs.",
        "You can also send us photos and approximate measurements to help us understand your project.",
      ],
    },
    {
      number: 2,
      title: "Get Your Quote",
      body: [
        "We'll review the information about your project and provide you with an estimate.",
        "If additional measurements or an on-site inspection are necessary, we'll arrange a convenient time.",
      ],
    },
    {
      number: 3,
      title: "Measure & Build",
      body: [
        "Your screens are measured and custom-built for the appropriate window openings.",
        "We focus on proper fit, clean workmanship, and quality materials.",
      ],
    },
    {
      number: 4,
      title: "Professional Installation",
      body: [
        "Once your screens are ready, we'll complete the installation and make sure everything fits and functions properly.",
      ],
    },
  ] satisfies Step[],
} as const;

/**
 * The three photographic bands other than the hero.
 *
 * Each one is the floor of a whole section rather than a picture inside it, so
 * they are chosen for what they can carry rather than for what they show: a
 * single subject, plenty of flat area, and no detail near the middle that a
 * scrim would ruin. All three are exteriors, which is the counterweight the
 * page needed — the hero is the inside of the window and everything else is
 * copy, so the outside of the house appears nowhere until here.
 *
 * `alt` is empty on all three, and deliberately. They are grounds: the section
 * heading directly on top of each one already says what the band is, and a
 * screen reader being told about siding and a roofline before it reaches the
 * heading is being given the decoration and not the content.
 *
 * Intrinsic sizes are recorded so `next/image` can reserve the box. All three
 * are worth downsampling in the repo — nothing on the page reads past 2560px.
 */
export const bandImages = {
  /** Why Choose Us. Four windows in a row, flat on, with the whole lower half
      of the frame plain siding — the calmest of the three under six columns of
      text. */
  whyChooseUs: {
    src: "/images/house-window-screen-1.jpg",
    width: 4845,
    height: 2710,
  },
  /** Screen Options. The one portrait source, which is what recommends it: this
      is the tallest band on the page and a landscape crop would be pulled to a
      sliver of itself. */
  screenOptions: {
    src: "/images/dithira-hettiarachchi-house-window-long-image.jpg",
    width: 3648,
    height: 5472,
  },
  /** The closer. A gable and a window against open sky — the most upward of the
      three, which is the right note to end the page on. */
  finalCta: {
    src: "/images/house-window-screen-1-manuela-johnston.jpg",
    width: 4928,
    height: 3264,
  },
} as const;

export const whyChooseUs = {
  eyebrow: "Why Choose Screenova Solutions?",
  title: "Custom Window Screens Built for Your Home",
  intro: [
    "A screen that nearly fits rattles, falls out, and lets in exactly what it was bought to keep out. Ours are built to the opening they go in.",
    "One visit covers measuring, building and fitting — you do not source materials, cut frames, or make a second appointment.",
  ],
  benefits: [
    {
      title: "Built to Your Opening",
      body: "Every screen is measured on site and built to that window, not cut down from a stock size.",
    },
    {
      title: "Quality Materials",
      body: "We use quality aluminum framing, screen mesh, spline, corners, and hardware designed for dependable everyday use.",
    },
    {
      title: "We Come to You",
      body: "Mobile service across Tampa Bay. Measuring, building and fitting all happen at your home — no hauling screens anywhere.",
    },
    {
      title: "Multiple Screen Options",
      body: "Choose from standard fiberglass mesh, pet-resistant screen, solar screen, and other available screening options depending on your needs.",
    },
    {
      title: "Local to Tampa Bay",
      body: "Hillsborough, Pinellas, Pasco and Manatee — from Tampa and St. Petersburg out to Clearwater, Lutz and Bradenton.",
    },
    {
      title: "Free Estimates",
      body: "Send a photo and rough sizes and we'll tell you whether it's a repair, a rescreen or a rebuild — before anything is booked.",
    },
  ] satisfies Benefit[],
  cta: "Request Your Free Quote",
} as const;

export const screenOptions = {
  eyebrow: "Screen Options",
  title: "Choose the Right Screen for Your Home",
  /** Four materials is a decision, and a decision is what a telephone is for. */
  cta: "Call Screenova",
  intro:
    "Different homes require different screening solutions. We'll help you select an option based on durability, visibility, airflow, pets, sunlight, and budget.",
  options: [
    {
      title: "Standard Fiberglass Screen",
      body: "A practical everyday screening option that provides good airflow and visibility while helping keep mosquitoes, flies, and other insects outside.",
      bestFor: "Standard residential windows",
    },
    {
      title: "Pet-Resistant Screen",
      body: "A stronger, heavier mesh designed to better withstand scratching and damage from dogs and cats.",
      bestFor: "Homes with pets",
    },
    {
      title: "Solar Screen",
      body: "Designed to block a portion of direct sunlight before it reaches the glass.",
      bestFor: "Windows receiving significant sun exposure, additional shade, and glare reduction",
    },
    {
      title: "Additional Screen Options",
      body: "Other mesh and screening options may be available depending on your project. Contact us and we'll help you determine which material works best for your home.",
    },
  ] satisfies ScreenOption[],
} as const;

export const about = {
  eyebrow: "About Screenova Solutions",
  title: "Mobile Window Screen Service Across Tampa Bay",
  body: [
    "Screenova Solutions builds, repairs, rescreens and fits window screens and sliding screen doors for homes across Tampa Bay.",
    "Screens are the part of a house nobody thinks about until one tears. Then it turns out to be a measuring job, a materials job and a fitting job — which is why most of them stay torn for years.",
    "We do all three at your door. Measuring, building and installation happen in the same visit, whether that is one screen on a lanai or every window in a house you have just bought.",
    "You get told which of the three answers your screen actually needs — a repair, a rescreen or a rebuild — and why, before any work is booked.",
  ],
  cta: "Get a Free Quote",
} as const;

export const serviceArea = {
  eyebrow: "Service Area",
  title: "Window Screen Services Throughout Tampa Bay",
  intro:
    "Screenova Solutions proudly provides window screen installation, replacement, rescreening, and repair services throughout the Tampa Bay Area.",
  /** The band's closing action: the one question this section raises. */
  cta: "Check Your ZIP Code",
  citiesLabel: "Cities We Serve",
  /**
   * The four the section shows a picture of.
   *
   * `href` is present only where a city page actually exists — three of these
   * four. Dunedin is served and pictured but has no page of its own, so it has
   * no link, because a link to a route that does not exist is a broken link.
   * Add the page first, then the href.
   */
  featured: [
    {
      name: "Tampa",
      href: "/tampa-window-screen-repair/",
      src: "/images/cities/Tampa-bay.jpg",
      alt: "The Tampa skyline across the bay",
    },
    {
      name: "St. Petersburg",
      href: "/st-petersburg-window-screen-repair/",
      src: "/images/cities/st-petersburg.jpg",
      alt: "The St. Petersburg waterfront",
    },
    {
      name: "Clearwater",
      href: "/clearwater-window-screen-repair/",
      src: "/images/cities/clearwater.jpg",
      alt: "The beach at Clearwater",
    },
    {
      name: "Dunedin",
      src: "/images/cities/dunedin.jpg",
      alt: "The waterfront at Dunedin",
    },
  ],
  otherCitiesLabel: "Other Cities We Serve",
  /**
   * Which of the named cities below link to a page of their own. One entry, and
   * it will stay a short list: a link per city is how a site ends up with
   * thirty doorway pages. A name that is not a key here is rendered as plain
   * text, which is the safe default.
   */
  cityLinks: {
    Lutz: "/lutz-window-screen-repair/",
  } as Record<string, string | undefined>,
  /** Everywhere else, by name only. */
  cities: [
    "Brandon",
    "Riverview",
    "Wesley Chapel",
    "Lutz",
    "Palm Harbor",
    "Largo",
    "Safety Harbor",
    "Oldsmar",
    "Valrico",
    "Apollo Beach",
    "Ruskin",
    "Sun City Center",
    "Pinellas Park",
    "Seminole",
    "Tarpon Springs",
    "Land O' Lakes",
    "Odessa",
    "Trinity",
    "New Port Richey",
    "Plant City",
    "Lithia",
    "Fish Hawk",
    "Temple Terrace",
    "Seffner",
    "Palmetto",
    "Bradenton",
    "Lakewood Ranch",
  ],
  outro:
    "Don't see your city listed? Contact us with your address and we'll let you know if your property is within our service area.",
} as const;

export const faq = {
  eyebrow: "Frequently Asked Questions",
  /** For the question the nine above did not answer. */
  ctaIntro: "Still not sure which one you need?",
  cta: "Call Screenova",
  items: [
    {
      question: "Do you make completely new window screens?",
      answer:
        "Yes. If your window doesn't currently have a screen or the existing frame needs replacement, we can measure and build a new screen specifically for the window opening.",
    },
    {
      question: "Can you replace only the screen mesh?",
      answer:
        "Yes. If your existing aluminum frame is still in usable condition, we can remove the old mesh and install new screen material.",
    },
    {
      question: "Do you repair torn window screens?",
      answer:
        "Yes. Depending on the condition of the frame and screen, we can determine whether rescreening or replacement is the better option.",
    },
    {
      question: "Do you provide pet-resistant screens?",
      answer:
        "Yes. Pet-resistant screen options are available for customers looking for additional durability.",
    },
    {
      question: "Do you offer solar screens?",
      answer:
        "Yes. Solar screening options are available for customers looking to reduce direct sunlight and glare.",
    },
    {
      question: "Can you replace multiple screens at the same property?",
      answer:
        "Absolutely. We can handle anything from individual screens to multiple windows throughout a home or property.",
    },
    {
      question: "Do I need to know the exact measurements?",
      answer:
        "Not necessarily. Approximate measurements and photos can help us prepare an initial estimate. When exact measurements are required for fabrication, we'll make sure the screens are properly measured before they are built.",
    },
    {
      question: "Can I send pictures for a quote?",
      answer:
        "Yes. Photos are very helpful. Send us pictures of your windows or existing screens along with the approximate number of screens you need.",
    },
    {
      question: "Do you serve my area?",
      answer:
        "We provide service throughout the Tampa Bay Area. Send us your address or ZIP code and we'll confirm availability.",
    },
  ] satisfies FaqItem[],
} as const;

export const quote = {
  eyebrow: "Get a Free Quote",
  title: "Torn, Missing or Damaged Screens?",
  intro: [
    "Three answers and you're done: your name, a number to reach you on, and your ZIP. Everything else is optional.",
    "Add a photo if you have one — it is usually the fastest route to an accurate price.",
  ],
  formTitle: "Quote Form",
  fields: {
    name: "Name",
    phone: "Phone Number",
    email: "Email",
    address: "Service Address",
    zip: "ZIP Code",
    service: "What service do you need?",
    quantity: "Approximately how many screens do you need?",
    measurements: "Approximate Width × Height (if known)",
    details: "Tell us about your project",
    photos: "Upload Photos",
  },
  /**
   * The placeholder in each field: an example of the answer, never a restatement
   * of the label. A label that says "Phone Number" over a box that says "Phone
   * Number" has spent a line to say nothing twice — these show the shape of what
   * goes in, which is the one thing a label cannot do.
   *
   * They are examples, not instructions, so they are written as somebody's real
   * answer would be: a whole street line rather than "Street, City", a sentence
   * in the details box rather than "Describe your project". The ZIP is a real
   * Tampa one, which doubles as a hint that this field decides something.
   *
   * `service` has none — a select shows its own first option — and neither does
   * the file input, which the browser labels itself.
   */
  hints: {
    name: "Jane Rivera",
    phone: "(813) 555-0134",
    email: "jane@example.com",
    zip: "33602",
    address: "1204 W Azeele St, Tampa",
    details: "Three torn screens on the lanai, and a slider that won't latch.",
    quantity: "6",
    measurements: 'Example: 36" × 48"',
  },
  /**
   * The seven services plus an eighth answer. "I'm Not Sure" is last and it is
   * a real option, not a fallback: most people cannot tell rescreening from
   * repair from replacement, and a required select with no honest answer for
   * them is a form they abandon rather than a form they get right.
   */
  serviceOptions: [
    "New Window Screens",
    "Window Rescreening",
    "Window Screen Repair",
    "Screen Frame Repair / Replacement",
    "Sliding Screen Door Rescreening",
    "Pet-Resistant Screens",
    "Solar Screens",
    "I'm Not Sure",
  ],
  /**
   * The two lines that sit under a field rather than in it. A placeholder
   * disappears the moment somebody types, so anything a person still needs
   * while they are answering has to be real text under the control.
   *
   * `measurements` is an example of the format, which is the one thing the
   * label cannot show. `photos` is the reason to bother — the photo upload is
   * the single most useful thing on this form and it was the only field with
   * nothing saying so.
   */
  helpText: {
    measurements: 'Example: 36" × 48"',
    photos: "Photos help us understand your project and may allow us to provide a faster estimate.",
  },
  submit: "Submit Request",
  /** Sits by the button, explaining the mark the five required labels carry. */
  requiredNote: "Required",
  /**
   * What the form says back. Two answers, and which one appears is decided by
   * the ZIP alone — every other field is checked by the browser before we get
   * here, so by the time a dialogue opens the only open question is whether we
   * drive to that address.
   *
   * `{phone}` and `{zip}` are filled from what was actually typed. Reading a
   * person's own number back to them is the cheapest way to catch the digit
   * they fat-fingered, and naming the ZIP in the refusal is what stops it
   * reading as a blanket "no".
   */
  dialog: {
    confirmed: {
      title: "Request received",
      body: [
        "A Screenova specialist will contact you within a few hours to discuss your project and provide your free quote.",
        "We have your number as {phone}. If it's urgent, calling us is always faster.",
      ],
      dismiss: "Done",
    },
    outOfArea: {
      title: "That ZIP is outside our route",
      body: [
        "This ZIP code appears to be outside our standard Tampa Bay service area. Give us a call — depending on your location and project size, we may still be able to help.",
        "The ZIP we checked was {zip}.",
      ],
      retry: "Try another ZIP",
      call: "Call us",
    },
  },
  /** The disclosure that holds the three fields most people leave empty. */
  optional: "Add quantity or approximate measurements",
  /** Under the button: the other way to reach us, for anyone who won't fill this in. */
  callInstead: "Prefer to talk? Call",
} as const;

/**
 * Our Projects.
 *
 * The nav has linked to `#projects` for some time with no such section on the
 * page — this is that section, and the link is no longer broken.
 *
 * It ships with **no photographs**, and that is the whole design of it. Every
 * category below describes a real kind of job Screenova does; none of them
 * claims to be showing one. When real before/after photography exists, drop
 * the pair into `before` / `after` on the matching category and the block
 * renders as a picture pair instead of a labelled placeholder. Nothing else
 * changes, and nothing here has to be invented in the meantime.
 *
 *   before / after — `{ src, alt }`, both or neither. A category with only one
 *   of the two stays a placeholder: a "before" with no "after" is not a
 *   project, it is a photograph of a broken screen.
 */
export type ProjectCategory = {
  id: string;
  title: string;
  body: string;
  before?: { src: string; alt: string };
  after?: { src: string; alt: string };
};

export const projects = {
  title: "Before & After",
  intro:
    "The four jobs we are called out for most. Photography from real Screenova projects is being added here — nothing on this page is a stock photograph of somebody else's work.",
  categories: [
    {
      id: "torn-to-new",
      title: "Torn Screen → New Screen",
      body: "A tear that started small and spread across the panel. Frame sound, mesh replaced.",
    },
    {
      id: "old-frame-to-custom",
      title: "Old Frame → Custom Frame",
      body: "A bent, corroded frame that no longer sat square in the opening, rebuilt in new aluminum to the same window.",
    },
    {
      id: "pet-damage",
      title: "Pet-Damaged Screen → Pet-Resistant Screen",
      body: "A slider pushed through at dog height, re-meshed in heavier pet-resistant material so it does not happen again.",
    },
    {
      id: "whole-house",
      title: "Whole-House Screen Replacement",
      body: "Every window in a property measured, built and fitted in a single visit.",
    },
    // `as` rather than `satisfies`: the surrounding `as const` would otherwise
    // narrow each entry to exactly the keys it has today, and `before`/`after`
    // — the two keys the whole section exists to receive — would not be part of
    // the type until somebody happened to fill one in.
  ] as ProjectCategory[],
  /** Shown while there is no photography, so the empty state says something. */
  pending: "Photos coming soon",
  cta: "Request Screen Service",
} as const;

/**
 * Reviews.
 *
 * `items` is empty, and it must stay empty until real reviews exist. The
 * section renders nothing at all while it is — see `Reviews.tsx` — so there is
 * no placeholder on the page pretending to be feedback, and no invented name,
 * city or star rating anywhere in this file.
 *
 * To publish: copy 3–6 genuine reviews from the Google Business Profile into
 * `items` in this shape and the section appears on its own.
 *
 *   { rating: 5, name: "…", city: "…", body: "…" }
 *
 * `rating` is 1–5 and is rendered as stars. Use the reviewer's name exactly as
 * it appears on the profile.
 */
export type Review = {
  rating: 1 | 2 | 3 | 4 | 5;
  name: string;
  city: string;
  body: string;
};

export const reviews = {
  title: "What Tampa Bay Homeowners Say",
  items: [] as readonly Review[],
} as const;

export const finalCta = {
  eyebrow: "Final Call to Action",
  title: "Ready to Fix or Replace Your Window Screens?",
  body: [
    "Send us a photo, a rough size, or just your address. We'll tell you what it needs and what it costs.",
    "Free estimates across Tampa Bay, and no charge for the drive.",
  ],
  primaryCta: "Get a Free Quote",
  secondaryCta: "Call Screenova Solutions",
  tagline: "Serving the Tampa Bay Area",
} as const;
