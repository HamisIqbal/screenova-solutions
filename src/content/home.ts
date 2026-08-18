/**
 * Source of truth for all copy on the page.
 *
 * Content lives here rather than inline in components so that when each section
 * gets its real design, the section component consumes this data and the copy
 * never has to be re-typed or kept in two places.
 */

/**
 * The photograph that stands behind a card while that card is the one being
 * read. See `CardStage` for how it is composited, and
 * `scripts/generate-placeholders.mjs` for what is currently sitting at each of
 * these paths.
 *
 * Every one of these is a placeholder today. `detail` is the brief for the real
 * photograph — what it has to show for the card it belongs to — so replacing
 * them is a matter of shooting to that line and dropping the file over the
 * placeholder at the same path. Nothing in any component names an image.
 *
 * `alt` is written for the real photograph rather than for the placeholder, and
 * is deliberately not rendered: the backdrop is decorative and goes out with an
 * empty alt. It is kept because the moment one of these is promoted into a card
 * as a real illustration, the sentence it needs already exists.
 */
export type CardImage = {
  src: string;
  alt: string;
  /** Art direction for the photograph that replaces the placeholder. */
  detail: string;
};

export type ServiceItem = {
  id: string;
  title: string;
  body: string[];
  image: CardImage;
  cta?: string;
};

export type Step = {
  number: number;
  title: string;
  body: string[];
  image: CardImage;
};

export type Benefit = {
  title: string;
  body: string;
  image: CardImage;
};

export type ScreenOption = {
  title: string;
  body: string;
  image: CardImage;
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
    "Professional window screen replacement, rescreening, and custom screen installation for homes and businesses throughout the Tampa Bay Area.",
  body: "Whether you need to replace a torn screen, rescreen an existing frame, or have a completely new window screen built, Screenova Solutions makes the process simple.",
  cta: "Get a Free Quote",
} as const;

export const services = {
  eyebrow: "Window Screen Services",
  title: "Window Screen Solutions for Every Home",
  intro:
    "From a single damaged screen to an entire home, Screenova Solutions provides professional window screening services throughout the Tampa Bay Area.",
  items: [
    {
      id: "new-window-screens",
      title: "New Window Screens",
      image: {
        src: "/images/placeholders/new-window-screens.jpg",
        alt: "A newly built aluminium window screen being lifted into a window opening from inside a house.",
        detail:
          "A finished screen going into an opening. Hands and frame both in shot, taken from inside the room so the daylight is behind the screen and the mesh reads as mesh.",
      },
      body: [
        "Missing a screen or need a completely new one?",
        "We build custom window screens to fit your existing window openings. Each screen is measured and fabricated to provide a clean, secure fit using quality aluminum framing and your preferred screen mesh.",
      ],
      cta: "Get a Quote",
    },
    {
      id: "window-rescreening",
      title: "Window Rescreening",
      image: {
        src: "/images/placeholders/window-rescreening.jpg",
        alt: "New fiberglass mesh being rolled into the spline channel of an existing aluminium screen frame on a workbench.",
        detail:
          "The spline roller mid-stroke on a bench. Shoot down the length of the frame at a shallow angle so the channel and the roller are both sharp and the old frame is visibly being reused.",
      },
      body: [
        "If your existing aluminum frame is still in good condition but the mesh is torn, loose, faded, or damaged, we can replace the screen mesh without replacing the entire frame.",
        "Rescreening is an affordable way to restore your existing window screens and keep insects outside while maintaining airflow.",
      ],
      cta: "Get a Quote",
    },
    {
      id: "window-screen-repair",
      title: "Window Screen Repair",
      image: {
        src: "/images/placeholders/window-screen-repair.jpg",
        alt: "A close-up of a torn screen corner with the frame corner key partly pulled out of the aluminium.",
        detail:
          "The damage, not the fix. Tight on a torn corner or a popped corner key, shallow depth of field, with enough of the window behind it to place the shot in a home.",
      },
      body: [
        "Damaged corners, loose spline, torn mesh, and other common screen problems can often be repaired without replacing the entire screen.",
        "We'll inspect the condition of your existing screen and recommend the most practical solution.",
      ],
      cta: "Get a Quote",
    },
    {
      id: "sliding-screen-door-rescreening",
      title: "Sliding Screen Door Rescreening",
      image: {
        src: "/images/placeholders/sliding-screen-door-rescreening.jpg",
        alt: "A sliding screen door standing in its track at a balcony opening, freshly rescreened.",
        detail:
          "A full sliding screen door in its track, shot square from inside, with the balcony or lanai bright behind it. The whole door in frame - this is the one card whose subject is a door rather than a window.",
      },
      body: [
        "A damaged sliding screen door doesn't always require a new door.",
        "We can replace worn or torn screen mesh on existing sliding screen doors and restore the screened opening.",
      ],
      cta: "Get a Quote",
    },
    {
      id: "pet-resistant-screens",
      title: "Pet-Resistant Screens",
      image: {
        src: "/images/placeholders/pet-resistant-screens.jpg",
        alt: "A dog resting against a heavy pet-resistant screen door with the mesh holding its shape.",
        detail:
          "A dog or a cat physically against the mesh. That contact is the entire proposition; without an animal in shot this card has no picture.",
      },
      body: [
        "Standard fiberglass screen can be easily damaged by dogs and cats.",
        "Pet-resistant screen mesh provides additional strength and durability for homeowners who need a tougher screening solution.",
        "Ask us about pet-resistant mesh options for windows and screen doors.",
      ],
    },
    {
      id: "solar-screens",
      title: "Solar Screens",
      image: {
        src: "/images/placeholders/solar-screens.jpg",
        alt: "A window fitted with dark solar screen mesh, with hard sunlight falling on the outside of the glass.",
        detail:
          "Shot from inside on a bright day, exposed for the room, so the solar mesh visibly cuts the glare rather than the window being blown out. A frame that also catches an unshaded window would be better still.",
      },
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
      image: {
        src: "/images/placeholders/tell-us-what-you-need.jpg",
        alt: "A homeowner photographing a damaged window screen on a phone.",
        detail:
          "A phone held up to a window screen, the damage visible on the phone display. The step is about sending photos, so the phone has to be doing the work.",
      },
      body: [
        "Contact Screenova Solutions and let us know how many screens you need and whether you're looking for new screens, rescreening, or repairs.",
        "You can also send us photos and approximate measurements to help us understand your project.",
      ],
    },
    {
      number: 2,
      title: "Get Your Quote",
      image: {
        src: "/images/placeholders/get-your-quote.jpg",
        alt: "A written estimate for window screen work on a clipboard beside a tape measure.",
        detail:
          "Paperwork and a tape measure on a windowsill or a tailgate. Keep any figures out of focus or illegible - nothing on this page should read as a published price.",
      },
      body: [
        "We'll review the information about your project and provide you with an estimate.",
        "If additional measurements or an on-site inspection are necessary, we'll arrange a convenient time.",
      ],
    },
    {
      number: 3,
      title: "Measure & Build",
      image: {
        src: "/images/placeholders/measure-and-build.jpg",
        alt: "Aluminium screen frame stock being cut to length in a workshop.",
        detail:
          "The fabrication step: a saw, a mitre, or a frame being squared up on a bench. Workshop, not a house - this is the one step that does not happen at the property.",
      },
      body: [
        "Your screens are measured and custom-built for the appropriate window openings.",
        "We focus on proper fit, clean workmanship, and quality materials.",
      ],
    },
    {
      number: 4,
      title: "Professional Installation",
      image: {
        src: "/images/placeholders/professional-installation.jpg",
        alt: "An installer seating a finished screen into a window frame from outside a house.",
        detail:
          "The screen going in, shot from outside so the installer and the house are both in frame. This is the closing image of the sequence and should be the calmest of the four.",
      },
      body: [
        "Once your screens are ready, we'll complete the installation and make sure everything fits and functions properly.",
      ],
    },
  ] satisfies Step[],
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
      image: {
        src: "/images/placeholders/custom-fit.jpg",
        alt: "A tape measure held across the inside of a window opening.",
        detail:
          "A tape measure stretched across an opening with the numbers readable. Tight, graphic, and unmistakably about measuring.",
      },
      body: "Every new screen is measured and built specifically for your window opening.",
    },
    {
      title: "Quality Materials",
      image: {
        src: "/images/placeholders/quality-materials.jpg",
        alt: "Rolls of screen mesh, spline, and aluminium corner keys laid out together.",
        detail:
          "A flat-lay of the materials - mesh rolls, spline coil, corners, hardware. Shot from directly overhead on a plain surface so it reads as an inventory rather than as clutter.",
      },
      body: "We use quality aluminum framing, screen mesh, spline, corners, and hardware designed for dependable everyday use.",
    },
    {
      title: "Convenient Service",
      image: {
        src: "/images/placeholders/convenient-service.jpg",
        alt: "A service van parked at the kerb of a Florida home with screens loaded in the back.",
        detail:
          "The van and the house together. The point is that someone else turns up and does the work, so the vehicle has to be in shot.",
      },
      body: "No need to figure out how to build or repair screens yourself. We handle measuring, fabrication, and installation.",
    },
    {
      title: "Multiple Screen Options",
      image: {
        src: "/images/placeholders/multiple-screen-options.jpg",
        alt: "Swatches of standard fiberglass, pet-resistant, and solar screen mesh side by side.",
        detail:
          "Three or four mesh swatches overlapping in one frame, backlit so the difference in openness and tint between them is actually visible. Lighting is what makes or breaks this one.",
      },
      body: "Choose from standard fiberglass mesh, pet-resistant screen, solar screen, and other available screening options depending on your needs.",
    },
    {
      title: "Local Tampa Bay Service",
      image: {
        src: "/images/placeholders/local-tampa-bay-service.jpg",
        alt: "A screened lanai looking out over a Tampa Bay neighbourhood at low sun.",
        detail:
          "Somewhere recognisably Tampa Bay seen through a screen - water, palms, or a lanai. The screen should be in the foreground and slightly out of focus.",
      },
      body: "Screenova Solutions proudly serves homeowners and businesses throughout the Tampa Bay Area.",
    },
    {
      title: "Free Quotes",
      image: {
        src: "/images/placeholders/free-quotes.jpg",
        alt: "A phone showing a message thread with photos of window screens attached.",
        detail:
          "A conversation in progress on a phone, with screen photos attached in the thread. Blur or mock every name and number in shot.",
      },
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
      image: {
        src: "/images/placeholders/standard-fiberglass-screen.jpg",
        alt: "A close macro of standard charcoal fiberglass screen mesh with a garden softly out of focus behind it.",
        detail:
          "Macro, mesh filling the frame, focus on the weave. A green garden behind it at wide aperture so the openness of the weave is obvious.",
      },
      body: "A practical everyday screening option that provides good airflow and visibility while helping keep mosquitoes, flies, and other insects outside.",
      bestFor: "Standard residential windows",
    },
    {
      title: "Pet-Resistant Screen",
      image: {
        src: "/images/placeholders/pet-resistant-screen.jpg",
        alt: "A close macro of heavy pet-resistant screen mesh showing its thicker vinyl-coated strands.",
        detail:
          "Same macro framing and distance as the standard fiberglass shot - the four Screen Options pictures are a comparison, so they have to be shot as a set with one lens and one light.",
      },
      body: "A stronger, heavier mesh designed to better withstand scratching and damage from dogs and cats.",
      bestFor: "Homes with pets",
    },
    {
      title: "Solar Screen",
      image: {
        src: "/images/placeholders/solar-screen.jpg",
        alt: "A close macro of dense solar screen mesh with bright sunlight behind it.",
        detail:
          "Same set as the other two meshes, but shot into the sun so the shading is the visible difference.",
      },
      body: "Designed to block a portion of direct sunlight before it reaches the glass.",
      bestFor: "Windows receiving significant sun exposure, additional shade, and glare reduction",
    },
    {
      title: "Additional Screen Options",
      image: {
        src: "/images/placeholders/additional-screen-options.jpg",
        alt: "An assortment of specialty screen mesh rolls stacked on a shelf.",
        detail:
          "Rolls on a shelf, ends toward camera, several different meshes visible. Deliberately the least specific of the four, because the card is the catch-all.",
      },
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
  citiesLabel: "Cities We Serve:",
  cities: [
    "Tampa",
    "St. Petersburg",
    "Clearwater",
    "Brandon",
    "Riverview",
    "Wesley Chapel",
    "Lutz",
    "Palm Harbor",
    "Largo",
    "Dunedin",
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
