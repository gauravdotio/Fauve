export type InfoSection = { heading: string; body: string[] };

export type InfoPage = {
  title: string;
  eyebrow: string;
  intro: string;
  updated?: string;
  format?: "prose" | "faq";
  sections: InfoSection[];
};

export const SUPPORT_PAGES: Record<string, InfoPage> = {
  shipping: {
    title: "Shipping",
    eyebrow: "Support",
    intro: "Every order is packed by hand in our studio and dispatched within 1–2 business days.",
    sections: [
      {
        heading: "Delivery options",
        body: [
          "Standard shipping (4–6 business days) is $8, or free on orders over $100.",
          "Express shipping (1–2 business days) is $22 and available on all orders placed before 1pm ET.",
        ],
      },
      {
        heading: "Tracking your order",
        body: [
          "As soon as your parcel leaves the studio you'll receive an email with a tracking link. Tracking can take up to 24 hours to show movement.",
        ],
      },
      {
        heading: "International orders",
        body: [
          "We currently ship to the United States and Canada. Orders to Canada may be subject to duties and taxes collected on delivery.",
        ],
      },
      {
        heading: "Packaging",
        body: [
          "Orders ship in recycled, plastic-free packaging. Garments are folded in tissue rather than individually bagged wherever possible.",
        ],
      },
    ],
  },
  returns: {
    title: "Returns & Exchanges",
    eyebrow: "Support",
    intro: "Not quite right? Returns and exchanges are free within 30 days of delivery.",
    sections: [
      {
        heading: "Our policy",
        body: [
          "Items can be returned within 30 days of delivery if they are unworn, unwashed, and have their original tags attached.",
          "Fragrance and grooming products can only be returned if unopened, for hygiene reasons.",
        ],
      },
      {
        heading: "How to start a return",
        body: [
          "Email our team with your order number and the items you'd like to return. We'll send a prepaid return label within one business day.",
        ],
      },
      {
        heading: "Refunds",
        body: [
          "Refunds are issued to your original payment method within 5 business days of your return arriving at our studio.",
        ],
      },
      {
        heading: "Exchanges",
        body: [
          "Need a different size or color? We'll reserve your replacement as soon as your return label is scanned, so you don't miss out if stock is low.",
        ],
      },
    ],
  },
  contact: {
    title: "Contact Us",
    eyebrow: "Support",
    intro: "Our customer care team replies to every message within one business day.",
    sections: [
      {
        heading: "Email",
        body: ["care@fauve.example.com — the fastest way to reach us about orders, sizing, or product questions."],
      },
      {
        heading: "Hours",
        body: ["Monday to Friday, 9am – 6pm ET. Messages sent over the weekend are answered first thing Monday."],
      },
      {
        heading: "Studio",
        body: ["Fauve Studio, 214 Wythe Avenue, Brooklyn, NY 11249. Visits are by appointment only."],
      },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    eyebrow: "Support",
    intro: "Quick answers to the questions we hear most often.",
    format: "faq",
    sections: [
      {
        heading: "How do your sizes run?",
        body: [
          "Our tops and outerwear are cut for a relaxed, true-to-size fit. If you're between sizes, size down for a closer fit or up for a looser silhouette. Each product page lists the material so you can judge drape and stretch.",
        ],
      },
      {
        heading: "When will a sold-out item come back?",
        body: [
          "Most core styles are restocked every 6–8 weeks. Join our newsletter to be the first to hear when favorites return.",
        ],
      },
      {
        heading: "Can I change or cancel my order?",
        body: [
          "We can adjust or cancel an order within two hours of it being placed. After that it's usually already being packed, but reach out and we'll do our best.",
        ],
      },
      {
        heading: "Where are your products made?",
        body: [
          "We work with a small group of long-term partners in Portugal, Italy, and Japan, selected for their craft and working conditions.",
        ],
      },
      {
        heading: "How should I care for wool and cashmere?",
        body: [
          "Wash sparingly, by hand in cold water with a wool detergent, and dry flat. Fold knitwear rather than hanging it to keep its shape.",
        ],
      },
    ],
  },
};

export const LEGAL_PAGES: Record<string, InfoPage> = {
  privacy: {
    title: "Privacy Policy",
    eyebrow: "Legal",
    intro: "This policy explains what information we collect when you use Fauve, and how we use it.",
    updated: "September 2026",
    sections: [
      {
        heading: "Information we collect",
        body: [
          "When you browse our store we collect basic technical information such as your device type and pages visited. When you sign up for our newsletter we collect your email address.",
          "Your shopping bag and wishlist are stored locally in your browser and are not sent to our servers.",
        ],
      },
      {
        heading: "How we use it",
        body: [
          "We use this information to operate and improve the store, respond to your requests, and — only if you opt in — send marketing emails.",
        ],
      },
      {
        heading: "Sharing",
        body: [
          "We never sell your personal information. We share it only with service providers that help us run the store, under agreements that protect your data.",
        ],
      },
      {
        heading: "Your choices",
        body: [
          "You can unsubscribe from marketing emails at any time using the link in any email, or contact us to access or delete the information we hold about you.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    eyebrow: "Legal",
    intro: "These terms govern your use of the Fauve website and any purchases you make through it.",
    updated: "September 2026",
    sections: [
      {
        heading: "Using our store",
        body: [
          "By accessing this website you agree to use it lawfully and not to interfere with its operation or security.",
        ],
      },
      {
        heading: "Products and pricing",
        body: [
          "We make every effort to display products, colors, and prices accurately. Prices are listed in US dollars and may change without notice. If an item is listed at an incorrect price, we reserve the right to cancel orders placed at that price.",
        ],
      },
      {
        heading: "Intellectual property",
        body: [
          "All content on this site — including text, photography, and the Fauve name — is owned by or licensed to Fauve and may not be reused without permission.",
        ],
      },
      {
        heading: "Contact",
        body: ["Questions about these terms can be sent to care@fauve.example.com."],
      },
    ],
  },
};
