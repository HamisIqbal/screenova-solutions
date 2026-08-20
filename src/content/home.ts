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
  subtitle:
    "Professional window screen replacement, rescreening, and custom screen installation for homes and businesses throughout the Tampa Bay Area. We also provide convenient mobile screen services, bringing expert screen repair and installation directly to your home or business.",
  body: "Whether you need to replace a torn screen, rescreen an existing frame, or have a completely new window screen built, Screenova Solutions makes the process simple.",
  cta: "Get a Free Quote",
} as const;

/**
 * The six services, in the order the scrolling stage steps through them.
 *
 * `image` points at the photograph in `public/images/services/`. To swap one,
 * drop the new file in under the same name and rewrite `imageAlt` to describe
 * what is in it; nothing else changes.
 */
export const services = {
  eyebrow: "Window Screen Services",
  title: "Window Screen Solutions for Every Home",
  intro:
    "From a single damaged screen to an entire home, Screenova Solutions provides professional window screening services throughout the Tampa Bay Area.",
  items: [
    {
      id: "new-window-screens",
      image: "/images/services/new-window-screens.png",
      imageAlt:
        "A newly built black-framed window screen leaning against a stucco wall beside the sliding window it was measured for.",
      title: "New Window Screens",
      body: [
        "Missing a screen or need a completely new one?",
        "We build custom window screens to fit your existing window openings. Each screen is measured and fabricated to provide a clean, secure fit using quality aluminum framing and your preferred screen mesh.",
      ],
      cta: "Get a Quote",
    },
    {
      id: "window-rescreening",
      image: "/images/services/window-rescreening.png",
      imageAlt:
        "A technician rolling new mesh into the channel of a black window screen frame with a spline roller.",
      title: "Window Rescreening",
      body: [
        "If your existing aluminum frame is still in good condition but the mesh is torn, loose, faded, or damaged, we can replace the screen mesh without replacing the entire frame.",
        "Rescreening is an affordable way to restore your existing window screens and keep insects outside while maintaining airflow.",
      ],
      cta: "Get a Quote",
    },
    {
      id: "window-screen-repair",
      image: "/images/services/window-screen-repair.png",
      imageAlt:
        "A technician cutting away torn mesh around a hole in a screen laid on a workbench, next to fresh spline, pliers, and a screwdriver.",
      title: "Window Screen Repair",
      body: [
        "Damaged corners, loose spline, torn mesh, and other common screen problems can often be repaired without replacing the entire screen.",
        "We'll inspect the condition of your existing screen and recommend the most practical solution.",
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
        "A damaged sliding screen door doesn't always require a new door.",
        "We can replace worn or torn screen mesh on existing sliding screen doors and restore the screened opening.",
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
        "Standard fiberglass screen can be easily damaged by dogs and cats.",
        "Pet-resistant screen mesh provides additional strength and durability for homeowners who need a tougher screening solution.",
        "Ask us about pet-resistant mesh options for windows and screen doors.",
      ],
    },
    {
      id: "solar-screens",
      image: "/images/services/solar-screens.png",
      imageAlt:
        "Two windows fitted with dark solar screens on a sunlit stucco wall, cutting the glare on the glass behind them.",
      title: "Solar Screens",
      body: [
        "Reduce direct sunlight entering your home with solar screen options.",
        "Solar screens can help reduce glare and provide additional shade while maintaining ventilation through your windows.",
        "Contact us to discuss available solar screen options.",
      ],
    },
  ] satisfies ServiceItem[],
} as const;

export const howItWorks = {
  eyebrow: "How It Works",
  title: "Getting New Screens Is Simple",
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
  title: "Simple. Professional. Built to Fit.",
  intro: [
    "Your window screens may seem like a small part of your home, but properly fitted screens make a big difference in comfort, ventilation, and appearance.",
    "Screenova Solutions provides a convenient, professional screening service from measurement through installation.",
  ],
  benefits: [
    {
      title: "Custom Fit",
      body: "Every new screen is measured and built specifically for your window opening.",
    },
    {
      title: "Quality Materials",
      body: "We use quality aluminum framing, screen mesh, spline, corners, and hardware designed for dependable everyday use.",
    },
    {
      title: "Convenient Service",
      body: "No need to figure out how to build or repair screens yourself. We handle measuring, fabrication, and installation.",
    },
    {
      title: "Multiple Screen Options",
      body: "Choose from standard fiberglass mesh, pet-resistant screen, solar screen, and other available screening options depending on your needs.",
    },
    {
      title: "Local Tampa Bay Service",
      body: "Screenova Solutions proudly serves homeowners and businesses throughout the Tampa Bay Area.",
    },
    {
      title: "Free Quotes",
      body: "Tell us about your project and we'll help you determine the right screening solution.",
    },
  ] satisfies Benefit[],
  cta: "Request Your Free Quote",
} as const;

export const screenOptions = {
  eyebrow: "Screen Options",
  title: "Choose the Right Screen for Your Home",
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
  title: "Your Local Window Screening Professionals",
  body: [
    "Screenova Solutions provides custom window screen fabrication, replacement, repair, and installation throughout the Tampa Bay Area.",
    "Our goal is simple: make replacing or repairing window screens easy for homeowners.",
    "Instead of dealing with measurements, materials, cutting frames, installing mesh, and trying to achieve the proper fit yourself, our team can handle the entire process.",
    "Whether you need one screen replaced or screens throughout your property, we approach every project with attention to detail and professional workmanship.",
    "We believe customers should receive clear communication, straightforward recommendations, and screening solutions built around what their property actually needs.",
  ],
  cta: "Get a Free Quote",
} as const;

export const serviceArea = {
  eyebrow: "Service Area",
  title: "Window Screen Services Throughout Tampa Bay",
  intro:
    "Screenova Solutions proudly provides window screen installation, replacement, rescreening, and repair services throughout the Tampa Bay Area.",
  citiesLabel: "Cities We Serve",
  /** The four the section shows a picture of. */
  featured: [
    {
      name: "Tampa",
      src: "/images/cities/Tampa-bay.jpg",
      alt: "The Tampa skyline across the bay",
    },
    {
      name: "St. Petersburg",
      src: "/images/cities/st-petersburg.jpg",
      alt: "The St. Petersburg waterfront",
    },
    {
      name: "Clearwater",
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
  title: "Need New Window Screens?",
  intro: [
    "Tell us a little about your project and Screenova Solutions will help you find the right solution.",
    "Whether you need one damaged screen replaced or new screens throughout your property, we're ready to help.",
  ],
  formTitle: "Quote Form",
  fields: {
    name: "Name",
    phone: "Phone Number",
    email: "Email",
    address: "Service Address / ZIP Code",
    service: "What service do you need?",
    quantity: "Approximately how many screens do you need?",
    measurements: "Approximate measurements, if available",
    details: "Tell us about your project",
    photos: "Upload Photos",
  },
  serviceOptions: [
    "New Window Screens",
    "Window Rescreening",
    "Window Screen Repair",
    "Sliding Screen Door Rescreening",
    "Pet-Resistant Screens",
    "Solar Screens",
    "Not Sure / Need Recommendation",
  ],
  submit: "Submit Request",
  /** The disclosure that holds the three fields most people leave empty. */
  optional: "Add quantity, measurements or photos",
  /** Under the button: the other way to reach us, for anyone who won't fill this in. */
  callInstead: "Prefer to talk? Call",
} as const;

export const finalCta = {
  eyebrow: "Final Call to Action",
  title: "Ready to Fix or Replace Your Window Screens?",
  body: [
    "Get professional window screen service without the hassle of measuring, sourcing materials, and building the screens yourself.",
    "Contact Screenova Solutions today for a free quote.",
  ],
  primaryCta: "Get a Free Quote",
  secondaryCta: "Call Screenova Solutions",
  tagline: "Serving the Tampa Bay Area",
} as const;
