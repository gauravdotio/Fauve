import type { CategoryWithCount, PaginatedResult, ProductFilters, ProductWithDetails } from "@/lib/types";
import type { ProductCard } from "@/lib/data";

const img = (id: string) => `https://images.unsplash.com/${id}`;
const DAY = 24 * 60 * 60 * 1000;

const C = {
  charcoal: ["Charcoal", "#3a3a3a"],
  camel: ["Camel", "#c19a6b"],
  olive: ["Olive", "#5b6340"],
  black: ["Black", "#1a1a1a"],
  navy: ["Navy", "#1e2a3a"],
  oatmeal: ["Oatmeal", "#d9cdb8"],
  forest: ["Forest", "#2f4a3c"],
  grey: ["Grey", "#8a8a8a"],
  white: ["White", "#f5f5f0"],
  sky: ["Sky Blue", "#a9c4d9"],
  stone: ["Stone", "#c9c2b2"],
  sage: ["Sage", "#a3ab94"],
  ecru: ["Ecru", "#e8e0cc"],
  indigo: ["Indigo", "#2b3a55"],
  khaki: ["Khaki", "#b8a878"],
  sand: ["Sand", "#c9b48a"],
  chocolate: ["Chocolate", "#5a3d2b"],
  cognac: ["Cognac", "#a05a2c"],
  tan: ["Tan", "#c19a6b"],
  slate: ["Slate", "#5c6670"],
  natural: ["Natural", "#e4dcc8"],
} as const;

interface RawProduct {
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  daysAgo: number;
  material: string;
  careInstructions: string;
  images: string[];
  variants: { size?: string; color?: string; colorHex?: string; stock: number }[];
}

interface RawCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  position: number;
  products: RawProduct[];
}

const RAW_CATEGORIES: RawCategory[] = [
  {
    id: "cat_outerwear",
    name: "Outerwear",
    slug: "outerwear",
    description:
      "Structured coats and jackets built for transitional weather, cut from weather-resistant wool and technical cotton.",
    image: img("photo-1539533113208-f6df8cc8b543"),
    position: 1,
    products: [
      {
        name: "Overcast Wool Coat",
        slug: "overcast-wool-coat",
        sku: "FV-OC-001",
        shortDescription: "A double-faced wool coat with a clean, architectural silhouette.",
        description:
          "Cut from a heavyweight double-faced wool, the Overcast Coat is built for the in-between seasons — structured enough to hold its shape, soft enough to live in. A concealed placket and dropped shoulder keep the front uninterrupted, while an interior chest pocket keeps essentials close.",
        price: 34900,
        compareAtPrice: 42900,
        rating: 4.8,
        reviewCount: 142,
        featured: true,
        daysAgo: 64,
        material: "80% wool, 20% nylon",
        careInstructions: "Dry clean only",
        images: [
          img("photo-1594748504715-2e715b1034bf"),
          img("photo-1619603364937-8d7af41ef206"),
          img("photo-1608748010899-18f300247112"),
        ],
        variants: [
          { size: "S", color: C.camel[0], colorHex: C.camel[1], stock: 5 },
          { size: "M", color: C.camel[0], colorHex: C.camel[1], stock: 9 },
          { size: "L", color: C.camel[0], colorHex: C.camel[1], stock: 0 },
          { size: "S", color: C.charcoal[0], colorHex: C.charcoal[1], stock: 8 },
          { size: "M", color: C.charcoal[0], colorHex: C.charcoal[1], stock: 12 },
          { size: "L", color: C.charcoal[0], colorHex: C.charcoal[1], stock: 6 },
        ],
      },
      {
        name: "Waxed Field Jacket",
        slug: "waxed-field-jacket",
        sku: "FV-OC-002",
        shortDescription: "Waxed cotton jacket with a corduroy collar, built to weather the elements.",
        description:
          "A field jacket in waxed organic cotton, finished with a corduroy under-collar and brass hardware. Four bellows pockets add real storage without adding bulk, and the wax finish develops a natural patina with wear.",
        price: 26900,
        rating: 4.6,
        reviewCount: 87,
        featured: true,
        daysAgo: 48,
        material: "100% waxed organic cotton",
        careInstructions: "Spot clean; re-wax annually",
        images: [
          img("photo-1548883354-d056ab7b441f"),
          img("photo-1594587639708-095eb3778067"),
          img("photo-1665859131237-fbe4f8c924a6"),
        ],
        variants: [
          { size: "S", color: C.olive[0], colorHex: C.olive[1], stock: 10 },
          { size: "M", color: C.olive[0], colorHex: C.olive[1], stock: 14 },
          { size: "L", color: C.olive[0], colorHex: C.olive[1], stock: 7 },
          { size: "M", color: C.black[0], colorHex: C.black[1], stock: 11 },
          { size: "L", color: C.black[0], colorHex: C.black[1], stock: 4 },
        ],
      },
      {
        name: "Storm Shell Parka",
        slug: "storm-shell-parka",
        sku: "FV-OC-003",
        shortDescription: "A seam-sealed 3-layer parka with a removable quilted liner.",
        description:
          "Engineered from a taped-seam 3-layer shell, the Storm Parka is fully seam-sealed and built to withstand sustained rain. A removable quilted liner adds warmth without changing the fit.",
        price: 32900,
        compareAtPrice: 38900,
        rating: 4.7,
        reviewCount: 63,
        daysAgo: 3,
        material: "Recycled nylon shell, removable recycled-polyester liner",
        careInstructions: "Machine wash cold, hang dry",
        images: [img("photo-1588202449437-1417d91f2ceb"), img("photo-1537221468392-f0e27be14323")],
        variants: [
          { size: "S", color: C.navy[0], colorHex: C.navy[1], stock: 6 },
          { size: "M", color: C.navy[0], colorHex: C.navy[1], stock: 9 },
          { size: "L", color: C.navy[0], colorHex: C.navy[1], stock: 5 },
          { size: "M", color: C.black[0], colorHex: C.black[1], stock: 8 },
          { size: "L", color: C.black[0], colorHex: C.black[1], stock: 3 },
        ],
      },
    ],
  },
  {
    id: "cat_knitwear",
    name: "Knitwear",
    slug: "knitwear",
    description: "Fine-gauge knits in merino, cotton, and cashmere blends — layering pieces designed to outlast a season.",
    image: img("photo-1580331451062-99ff652288d7"),
    position: 2,
    products: [
      {
        name: "Merino Crewneck Sweater",
        slug: "merino-crewneck-sweater",
        sku: "FV-KN-001",
        shortDescription: "A 14-gauge merino crewneck with a soft, breathable hand-feel.",
        description:
          "Knitted from extra-fine merino wool in a 14-gauge construction, this crewneck sits between a t-shirt and a heavier knit — light enough to layer, warm enough to wear alone.",
        price: 12900,
        rating: 4.9,
        reviewCount: 211,
        featured: true,
        daysAgo: 90,
        material: "100% extra-fine merino wool",
        careInstructions: "Hand wash cold, dry flat",
        images: [
          img("photo-1574201635302-388dd92a4c3f"),
          img("photo-1600369672890-ac00f1907858"),
          img("photo-1629580626780-7fe7fb0523e9"),
        ],
        variants: [
          { size: "XS", color: C.oatmeal[0], colorHex: C.oatmeal[1], stock: 7 },
          { size: "S", color: C.oatmeal[0], colorHex: C.oatmeal[1], stock: 13 },
          { size: "M", color: C.oatmeal[0], colorHex: C.oatmeal[1], stock: 18 },
          { size: "L", color: C.oatmeal[0], colorHex: C.oatmeal[1], stock: 9 },
          { size: "S", color: C.charcoal[0], colorHex: C.charcoal[1], stock: 10 },
          { size: "M", color: C.charcoal[0], colorHex: C.charcoal[1], stock: 15 },
          { size: "M", color: C.navy[0], colorHex: C.navy[1], stock: 12 },
          { size: "L", color: C.navy[0], colorHex: C.navy[1], stock: 6 },
        ],
      },
      {
        name: "Cable Knit Cardigan",
        slug: "cable-knit-cardigan",
        sku: "FV-KN-002",
        shortDescription: "A chunky cable-knit cardigan with horn buttons and patch pockets.",
        description:
          "A heavyweight cardigan knit in a traditional cable pattern, finished with natural horn buttons and dual patch pockets. A wool-cotton blend keeps it warm without the itch.",
        price: 15900,
        rating: 4.5,
        reviewCount: 58,
        daysAgo: 120,
        material: "70% wool, 30% cotton",
        careInstructions: "Hand wash cold, dry flat",
        images: [img("photo-1581497396202-5645e76a3a8e"), img("photo-1634901581982-6b408cf4226a")],
        variants: [
          { size: "S", color: C.camel[0], colorHex: C.camel[1], stock: 4 },
          { size: "M", color: C.camel[0], colorHex: C.camel[1], stock: 8 },
          { size: "L", color: C.camel[0], colorHex: C.camel[1], stock: 5 },
          { size: "M", color: C.forest[0], colorHex: C.forest[1], stock: 7 },
          { size: "L", color: C.forest[0], colorHex: C.forest[1], stock: 3 },
        ],
      },
      {
        name: "Cashmere Blend Turtleneck",
        slug: "cashmere-blend-turtleneck",
        sku: "FV-KN-003",
        shortDescription: "A featherweight cashmere-cotton turtleneck for year-round layering.",
        description:
          "A turtleneck spun from a cashmere-cotton blend that stays light enough for three-season wear. The fine gauge layers cleanly under a coat or blazer.",
        price: 18900,
        compareAtPrice: 22900,
        rating: 4.7,
        reviewCount: 96,
        featured: true,
        daysAgo: 6,
        material: "60% cotton, 40% cashmere",
        careInstructions: "Dry clean recommended",
        images: [img("photo-1610901157620-340856d0a50f"), img("photo-1603906650843-b58e94d9df4d")],
        variants: [
          { size: "S", color: C.black[0], colorHex: C.black[1], stock: 9 },
          { size: "M", color: C.black[0], colorHex: C.black[1], stock: 14 },
          { size: "L", color: C.black[0], colorHex: C.black[1], stock: 6 },
          { size: "M", color: C.grey[0], colorHex: C.grey[1], stock: 10 },
          { size: "L", color: C.grey[0], colorHex: C.grey[1], stock: 5 },
        ],
      },
    ],
  },
  {
    id: "cat_shirts",
    name: "Shirts & Tops",
    slug: "shirts-tops",
    description: "Poplin shirts and heavyweight jersey with a considered fit, made from long-staple cotton and linen.",
    image: img("photo-1602810318383-e386cc2a3ccf"),
    position: 3,
    products: [
      {
        name: "Oxford Poplin Shirt",
        slug: "oxford-poplin-shirt",
        sku: "FV-SH-001",
        shortDescription: "A crisp poplin shirt with a soft button-down collar.",
        description:
          "Woven from long-staple cotton poplin, this shirt holds a crisp finish through repeated washing. A soft button-down collar and single chest pocket keep the design quiet.",
        price: 8900,
        rating: 4.6,
        reviewCount: 174,
        featured: true,
        daysAgo: 75,
        material: "100% long-staple cotton",
        careInstructions: "Machine wash cold, iron on low",
        images: [
          img("photo-1624835567150-0c530a20d8cc"),
          img("photo-1620012253295-c15cc3e65df4"),
          img("photo-1604695573706-53170668f6a6"),
        ],
        variants: [
          { size: "S", color: C.sky[0], colorHex: C.sky[1], stock: 12 },
          { size: "M", color: C.sky[0], colorHex: C.sky[1], stock: 18 },
          { size: "L", color: C.sky[0], colorHex: C.sky[1], stock: 9 },
          { size: "S", color: C.white[0], colorHex: C.white[1], stock: 20 },
          { size: "M", color: C.white[0], colorHex: C.white[1], stock: 25 },
          { size: "L", color: C.white[0], colorHex: C.white[1], stock: 15 },
          { size: "M", color: C.stone[0], colorHex: C.stone[1], stock: 10 },
          { size: "L", color: C.stone[0], colorHex: C.stone[1], stock: 7 },
        ],
      },
      {
        name: "Heavyweight Pocket Tee",
        slug: "heavyweight-pocket-tee",
        sku: "FV-SH-002",
        shortDescription: "A 240gsm cotton tee with a boxy, considered fit.",
        description:
          "Built from 240gsm combed cotton, this tee has enough weight to hold its shape and drape rather than cling. A single chest pocket and dropped shoulder seam give it a slightly boxy fit.",
        price: 4500,
        rating: 4.8,
        reviewCount: 203,
        daysAgo: 150,
        material: "100% combed cotton",
        careInstructions: "Machine wash cold",
        images: [img("photo-1581655353564-df123a1eb820"), img("photo-1521572163474-6864f9cf17ab")],
        variants: [
          { size: "XS", color: C.white[0], colorHex: C.white[1], stock: 15 },
          { size: "S", color: C.white[0], colorHex: C.white[1], stock: 22 },
          { size: "M", color: C.white[0], colorHex: C.white[1], stock: 28 },
          { size: "L", color: C.white[0], colorHex: C.white[1], stock: 14 },
          { size: "M", color: C.black[0], colorHex: C.black[1], stock: 19 },
          { size: "M", color: C.sage[0], colorHex: C.sage[1], stock: 11 },
          { size: "L", color: C.sage[0], colorHex: C.sage[1], stock: 6 },
        ],
      },
      {
        name: "Linen Band-Collar Shirt",
        slug: "linen-band-collar-shirt",
        sku: "FV-SH-003",
        shortDescription: "A relaxed European linen shirt with a minimal band collar.",
        description:
          "Garment-washed European linen gives this shirt a soft, lived-in texture from the first wear. A band collar and hidden placket keep it clean enough to tuck in.",
        price: 9900,
        rating: 4.4,
        reviewCount: 41,
        daysAgo: 15,
        material: "100% European linen",
        careInstructions: "Machine wash cold, line dry",
        images: [img("photo-1627686011747-74adda3d2343"), img("photo-1621072156002-e2fccdc0b176")],
        variants: [
          { size: "S", color: C.ecru[0], colorHex: C.ecru[1], stock: 8 },
          { size: "M", color: C.ecru[0], colorHex: C.ecru[1], stock: 11 },
          { size: "L", color: C.ecru[0], colorHex: C.ecru[1], stock: 5 },
          { size: "M", color: C.sage[0], colorHex: C.sage[1], stock: 9 },
          { size: "L", color: C.sage[0], colorHex: C.sage[1], stock: 0 },
        ],
      },
    ],
  },
  {
    id: "cat_trousers",
    name: "Trousers & Denim",
    slug: "trousers-denim",
    description: "Tailored trousers and selvedge denim, finished with a clean, modern silhouette.",
    image: img("photo-1584184924103-e310d9dc82fc"),
    position: 4,
    products: [
      {
        name: "Tapered Wool Trousers",
        slug: "tapered-wool-trousers",
        sku: "FV-TR-001",
        shortDescription: "Mid-weight wool trousers with a tapered leg and clean front.",
        description:
          "Tailored from a mid-weight wool suiting fabric, these trousers hold a sharp crease and taper cleanly from knee to ankle.",
        price: 14900,
        rating: 4.6,
        reviewCount: 77,
        featured: true,
        daysAgo: 55,
        material: "98% wool, 2% elastane",
        careInstructions: "Dry clean only",
        images: [img("photo-1619470148547-0adbfc64b595"), img("photo-1611937669166-be4e0503b115")],
        variants: [
          { size: "S", color: C.stone[0], colorHex: C.stone[1], stock: 12 },
          { size: "M", color: C.stone[0], colorHex: C.stone[1], stock: 16 },
          { size: "L", color: C.stone[0], colorHex: C.stone[1], stock: 5 },
          { size: "M", color: C.charcoal[0], colorHex: C.charcoal[1], stock: 10 },
          { size: "L", color: C.charcoal[0], colorHex: C.charcoal[1], stock: 8 },
        ],
      },
      {
        name: "Selvedge Straight Jean",
        slug: "selvedge-straight-jean",
        sku: "FV-TR-002",
        shortDescription: "13oz Japanese selvedge denim in a straight, rigid indigo.",
        description:
          "Woven on a vintage shuttle loom from 13oz Japanese cotton, this straight-leg jean is built to break in and fade with wear.",
        price: 15900,
        compareAtPrice: 18900,
        rating: 4.9,
        reviewCount: 156,
        featured: true,
        daysAgo: 100,
        material: "100% cotton selvedge denim",
        careInstructions: "Wash cold, inside out, sparingly",
        images: [
          img("photo-1714143136367-7bb68f3f0669"),
          img("photo-1714143164072-7646ef5cb24d"),
          img("photo-1603202577997-003d15cfc20b"),
        ],
        variants: [
          { size: "30", color: C.indigo[0], colorHex: C.indigo[1], stock: 9 },
          { size: "32", color: C.indigo[0], colorHex: C.indigo[1], stock: 15 },
          { size: "34", color: C.indigo[0], colorHex: C.indigo[1], stock: 11 },
          { size: "36", color: C.indigo[0], colorHex: C.indigo[1], stock: 6 },
          { size: "32", color: C.black[0], colorHex: C.black[1], stock: 8 },
          { size: "34", color: C.black[0], colorHex: C.black[1], stock: 5 },
        ],
      },
      {
        name: "Pleated Chino",
        slug: "pleated-chino",
        sku: "FV-TR-003",
        shortDescription: "A relaxed double-pleat chino in brushed cotton twill.",
        description:
          "A double-pleated chino cut with a roomier thigh and tapered ankle, in a brushed cotton twill that softens with every wash.",
        price: 10900,
        rating: 4.3,
        reviewCount: 34,
        daysAgo: 130,
        material: "100% brushed cotton twill",
        careInstructions: "Machine wash cold",
        images: [img("photo-1473966968600-fa801b869a1a"), img("photo-1584865288642-42078afe6942")],
        variants: [
          { size: "S", color: C.khaki[0], colorHex: C.khaki[1], stock: 10 },
          { size: "M", color: C.khaki[0], colorHex: C.khaki[1], stock: 14 },
          { size: "L", color: C.khaki[0], colorHex: C.khaki[1], stock: 7 },
          { size: "M", color: C.navy[0], colorHex: C.navy[1], stock: 9 },
        ],
      },
    ],
  },
  {
    id: "cat_footwear",
    name: "Footwear",
    slug: "footwear",
    description: "Minimal sneakers and leather boots built on comfort-first lasts.",
    image: img("photo-1542490757-abcb453d75d9"),
    position: 5,
    products: [
      {
        name: "Court Leather Sneaker",
        slug: "court-leather-sneaker",
        sku: "FV-FW-001",
        shortDescription: "A minimal court sneaker in full-grain leather with a cushioned cupsole.",
        description:
          "A clean-lined court sneaker built from full-grain leather over a cushioned cupsole. Minimal branding and a low profile.",
        price: 17900,
        rating: 4.7,
        reviewCount: 231,
        featured: true,
        daysAgo: 40,
        material: "Full-grain leather upper, rubber cupsole",
        careInstructions: "Wipe clean with a damp cloth",
        images: [
          img("photo-1596744271582-1d87e9aae223"),
          img("photo-1604163334803-e927c2c03a96"),
          img("photo-1561282109-3a8f490997cc"),
        ],
        variants: [
          { size: "40", color: C.white[0], colorHex: C.white[1], stock: 12 },
          { size: "41", color: C.white[0], colorHex: C.white[1], stock: 16 },
          { size: "42", color: C.white[0], colorHex: C.white[1], stock: 18 },
          { size: "43", color: C.white[0], colorHex: C.white[1], stock: 10 },
          { size: "42", color: C.black[0], colorHex: C.black[1], stock: 9 },
          { size: "43", color: C.black[0], colorHex: C.black[1], stock: 6 },
        ],
      },
      {
        name: "Suede Desert Boot",
        slug: "suede-desert-boot",
        sku: "FV-FW-002",
        shortDescription: "A crepe-soled desert boot in soft, water-resistant suede.",
        description:
          "A classic two-eyelet desert boot built on a natural crepe sole that grows more flexible with age.",
        price: 19900,
        rating: 4.6,
        reviewCount: 118,
        daysAgo: 85,
        material: "Suede upper, crepe rubber sole",
        careInstructions: "Brush clean; treat with suede protector",
        images: [img("photo-1674293600869-c4aee0c9051f"), img("photo-1616688577198-0462bcecbdf9")],
        variants: [
          { size: "40", color: C.sand[0], colorHex: C.sand[1], stock: 8 },
          { size: "41", color: C.sand[0], colorHex: C.sand[1], stock: 11 },
          { size: "42", color: C.sand[0], colorHex: C.sand[1], stock: 13 },
          { size: "42", color: C.chocolate[0], colorHex: C.chocolate[1], stock: 7 },
          { size: "43", color: C.chocolate[0], colorHex: C.chocolate[1], stock: 4 },
        ],
      },
      {
        name: "Minimal Runner",
        slug: "minimal-runner",
        sku: "FV-FW-003",
        shortDescription: "A low-profile knit runner built for all-day comfort.",
        description:
          "An engineered knit upper wraps the foot with no seams at the pressure points, mounted on a lightweight EVA midsole.",
        price: 15900,
        compareAtPrice: 19900,
        rating: 4.5,
        reviewCount: 89,
        daysAgo: 9,
        material: "Engineered knit upper, EVA midsole",
        careInstructions: "Machine wash cold, air dry",
        images: [img("photo-1639572600664-28a2a01ce860"), img("photo-1639572604550-7b958a14eaa9")],
        variants: [
          { size: "40", color: C.white[0], colorHex: C.white[1], stock: 14 },
          { size: "41", color: C.white[0], colorHex: C.white[1], stock: 17 },
          { size: "42", color: C.white[0], colorHex: C.white[1], stock: 20 },
          { size: "42", color: C.grey[0], colorHex: C.grey[1], stock: 15 },
          { size: "43", color: C.grey[0], colorHex: C.grey[1], stock: 0 },
        ],
      },
    ],
  },
  {
    id: "cat_bags",
    name: "Bags & Accessories",
    slug: "bags-accessories",
    description: "Full-grain leather bags and everyday accessories, built to age well.",
    image: img("photo-1535120927584-0230f40fc1e2"),
    position: 6,
    products: [
      {
        name: "Full-Grain Weekender",
        slug: "full-grain-weekender",
        sku: "FV-BA-001",
        shortDescription: "A full-grain leather weekender with solid brass hardware.",
        description:
          "Built from vegetable-tanned full-grain leather over a structured base, the Weekender holds its shape whether it's empty or full.",
        price: 32900,
        rating: 4.8,
        reviewCount: 72,
        featured: true,
        daysAgo: 70,
        material: "Full-grain vegetable-tanned leather",
        careInstructions: "Condition leather every 6 months",
        images: [
          img("photo-1525103504173-8dc1582c7430"),
          img("photo-1479219136056-56bb6495a005"),
          img("photo-1555494183-648c287e29bc"),
        ],
        variants: [
          { color: C.cognac[0], colorHex: C.cognac[1], stock: 6 },
          { color: C.black[0], colorHex: C.black[1], stock: 9 },
        ],
      },
      {
        name: "Structured Tote",
        slug: "structured-tote",
        sku: "FV-BA-002",
        shortDescription: "A structured leather tote sized for a 15-inch laptop.",
        description:
          "A work tote with a rigid base and structured sides that keep their shape unloaded. Fits a 15-inch laptop in a padded interior sleeve.",
        price: 21900,
        rating: 4.6,
        reviewCount: 54,
        daysAgo: 110,
        material: "Full-grain leather, cotton canvas lining",
        careInstructions: "Wipe clean; condition occasionally",
        images: [img("photo-1624687943971-e86af76d57de"), img("photo-1637759292654-a12cb2be085e")],
        variants: [
          { color: C.tan[0], colorHex: C.tan[1], stock: 7 },
          { color: C.black[0], colorHex: C.black[1], stock: 10 },
        ],
      },
      {
        name: "Leather Card Holder",
        slug: "leather-card-holder",
        sku: "FV-BA-003",
        shortDescription: "A slim four-card holder in vegetable-tanned leather.",
        description:
          "A minimal card holder cut from a single piece of vegetable-tanned leather, hand-folded and edge-burnished.",
        price: 5900,
        rating: 4.7,
        reviewCount: 129,
        daysAgo: 160,
        material: "Vegetable-tanned leather",
        careInstructions: "Wipe clean; condition occasionally",
        images: [img("photo-1627123424574-724758594e93"), img("photo-1560472355-536de3962603")],
        variants: [
          { color: C.cognac[0], colorHex: C.cognac[1], stock: 18 },
          { color: C.black[0], colorHex: C.black[1], stock: 25 },
        ],
      },
    ],
  },
  {
    id: "cat_home",
    name: "Home & Living",
    slug: "home-living",
    description: "Considered objects for the table and the shelf — ceramics, candles, and linen.",
    image: img("photo-1583847268964-b28dc8f51f92"),
    position: 7,
    products: [
      {
        name: "Hand-Thrown Stoneware Mug",
        slug: "hand-thrown-stoneware-mug",
        sku: "FV-HM-001",
        shortDescription: "A hand-thrown stoneware mug with a matte speckled glaze.",
        description:
          "Each mug is thrown on the wheel and finished with a matte speckled glaze, so no two are identical. Holds 12oz.",
        price: 3400,
        rating: 4.9,
        reviewCount: 167,
        daysAgo: 45,
        material: "Stoneware, matte glaze",
        careInstructions: "Dishwasher safe; hand wash recommended",
        images: [
          img("photo-1666445844615-0a3930270f13"),
          img("photo-1495100497150-fe209c585f50"),
          img("photo-1517430536-ef20313aea20"),
        ],
        variants: [
          { color: C.sand[0], colorHex: C.sand[1], stock: 30 },
          { color: C.slate[0], colorHex: C.slate[1], stock: 22 },
        ],
      },
      {
        name: "Cedar & Sage Candle",
        slug: "cedar-sage-candle",
        sku: "FV-HM-003",
        shortDescription: "A hand-poured soy candle in cedar, sage, and dried moss.",
        description:
          "Hand-poured in small batches using a coconut-soy wax blend and a cotton wick. Scent opens with sage and dries down to cedar and moss.",
        price: 4200,
        compareAtPrice: 5200,
        rating: 4.8,
        reviewCount: 214,
        featured: true,
        daysAgo: 12,
        material: "Coconut-soy wax, cotton wick",
        careInstructions: "Trim wick to 1/4 inch before each burn",
        images: [img("photo-1603006905003-be475563bc59"), img("photo-1605651202774-7d573fd3f12d")],
        variants: [{ stock: 46 }],
      },
    ],
  },
  {
    id: "cat_grooming",
    name: "Fragrance & Grooming",
    slug: "fragrance-grooming",
    description: "Small-batch fragrance and grooming essentials with a restrained, woody palette.",
    image: img("photo-1622618991746-fe6004db3a47"),
    position: 8,
    products: [
      {
        name: "Eau de Parfum No. 02",
        slug: "eau-de-parfum-no-02",
        sku: "FV-FR-001",
        shortDescription: "A woody, grounded fragrance built around vetiver and cedar.",
        description:
          "No. 02 opens with bergamot and black pepper, settles into a heart of vetiver and cedar, and dries down to a warm base of amber and musk.",
        price: 9800,
        rating: 4.7,
        reviewCount: 145,
        featured: true,
        daysAgo: 30,
        material: "Eau de parfum, 50ml",
        careInstructions: "Store away from direct sunlight",
        images: [img("photo-1615160460524-432433ba1b8f"), img("photo-1622618991746-fe6004db3a47")],
        variants: [{ stock: 60 }],
      },
    ],
  },
];

// Build normalized in-memory data structures
const fallbackCategories: CategoryWithCount[] = RAW_CATEGORIES.map((c) => ({
  id: c.id,
  name: c.name,
  slug: c.slug,
  description: c.description,
  image: c.image,
  position: c.position,
  createdAt: new Date("2026-08-28T00:00:00.000Z"),
  updatedAt: new Date("2026-09-15T00:00:00.000Z"),
  productCount: c.products.length,
}));

const fallbackProductsWithDetails: ProductWithDetails[] = [];
const fallbackProductCards: ProductCard[] = [];

let pIdCounter = 1;
let vIdCounter = 1;
let imgIdCounter = 1;

for (const cat of RAW_CATEGORIES) {
  const categoryModel = {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    image: cat.image,
    position: cat.position,
    createdAt: new Date("2026-08-28T00:00:00.000Z"),
    updatedAt: new Date("2026-09-15T00:00:00.000Z"),
  };

  for (const raw of cat.products) {
    const prodId = `prod_${pIdCounter++}`;
    const createdAt = new Date(Date.now() - raw.daysAgo * DAY);
    const totalStock = raw.variants.reduce((acc, curr) => acc + curr.stock, 0);

    const images = raw.images.map((url, idx) => ({
      id: `img_${imgIdCounter++}`,
      url,
      alt: idx === 0 ? raw.name : `${raw.name} view ${idx + 1}`,
      position: idx,
      productId: prodId,
      createdAt: new Date("2026-08-28T00:00:00.000Z"),
    }));

    const variants = raw.variants.map((variant, idx) => ({
      id: `var_${vIdCounter++}`,
      sku: `${raw.sku}-${idx + 1}`,
      size: variant.size ?? null,
      color: variant.color ?? null,
      colorHex: variant.colorHex ?? null,
      priceOffset: 0,
      stock: variant.stock,
      productId: prodId,
      createdAt: new Date("2026-08-28T00:00:00.000Z"),
      updatedAt: new Date("2026-09-15T00:00:00.000Z"),
    }));

    const fullProduct: ProductWithDetails = {
      id: prodId,
      name: raw.name,
      slug: raw.slug,
      sku: raw.sku,
      shortDescription: raw.shortDescription,
      description: raw.description,
      price: raw.price,
      compareAtPrice: raw.compareAtPrice ?? null,
      brand: "Fauve",
      rating: raw.rating,
      reviewCount: raw.reviewCount,
      featured: raw.featured ?? false,
      stock: totalStock,
      status: "ACTIVE",
      material: raw.material,
      careInstructions: raw.careInstructions,
      categoryId: cat.id,
      createdAt,
      updatedAt: new Date("2026-09-15T00:00:00.000Z"),
      category: categoryModel,
      images,
      variants,
    };

    fallbackProductsWithDetails.push(fullProduct);

    fallbackProductCards.push({
      id: prodId,
      name: raw.name,
      slug: raw.slug,
      price: raw.price,
      compareAtPrice: raw.compareAtPrice ?? null,
      rating: raw.rating,
      reviewCount: raw.reviewCount,
      stock: totalStock,
      status: "ACTIVE",
      createdAt,
      isNew: raw.daysAgo <= 21,
      category: { name: cat.name, slug: cat.slug },
      images: images.slice(0, 2).map((img) => ({ url: img.url, alt: img.alt })),
      variants: variants.map((v) => ({ id: v.id, size: v.size, color: v.color, stock: v.stock })),
    });
  }
}

export function getFallbackCategories(): CategoryWithCount[] {
  return fallbackCategories;
}

export function getFallbackCategoryBySlug(slug: string): CategoryWithCount | null {
  return fallbackCategories.find((c) => c.slug === slug) ?? null;
}

export function getFallbackProductBySlug(slug: string): ProductWithDetails | null {
  return fallbackProductsWithDetails.find((p) => p.slug === slug) ?? null;
}

export function getFallbackFeaturedProducts(limit = 8): ProductCard[] {
  return fallbackProductCards
    .filter((p) => {
      const match = fallbackProductsWithDetails.find((d) => d.id === p.id);
      return match?.featured;
    })
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export function getFallbackNewArrivals(limit = 8): ProductCard[] {
  return [...fallbackProductCards]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}

export function getFallbackBestRated(limit = 8): ProductCard[] {
  return [...fallbackProductCards]
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, limit);
}

export function getFallbackRelatedProducts(categoryId: string, excludeProductId: string, limit = 4): ProductCard[] {
  const matching = fallbackProductCards.filter((p) => {
    const full = fallbackProductsWithDetails.find((d) => d.id === p.id);
    return full?.categoryId === categoryId && p.id !== excludeProductId;
  });

  if (matching.length >= limit) return matching.slice(0, limit);

  const extra = fallbackProductCards.filter((p) => p.id !== excludeProductId && !matching.some((m) => m.id === p.id));
  return [...matching, ...extra].slice(0, limit);
}

export function getFallbackProducts(filters: ProductFilters = {}): PaginatedResult<ProductCard> {
  const { categorySlug, search, sizes, colors, minPrice, maxPrice, sort = "featured", perPage = 12 } = filters;
  const page = Math.max(1, filters.page ?? 1);

  let list = fallbackProductCards.filter((card) => {
    const full = fallbackProductsWithDetails.find((p) => p.id === card.id);
    if (!full) return false;

    if (categorySlug && card.category.slug !== categorySlug) return false;
    if (minPrice !== undefined && card.price < minPrice) return false;
    if (maxPrice !== undefined && card.price > maxPrice) return false;

    if (search) {
      const q = search.toLowerCase();
      const matchName = card.name.toLowerCase().includes(q);
      const matchDesc = full.shortDescription.toLowerCase().includes(q);
      const matchCat = card.category.name.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat) return false;
    }

    if (sizes?.length) {
      const hasSize = card.variants.some((v) => v.size && sizes.includes(v.size));
      if (!hasSize) return false;
    }

    if (colors?.length) {
      const hasColor = card.variants.some((v) => v.color && colors.includes(v.color));
      if (!hasColor) return false;
    }

    return true;
  });

  switch (sort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      break;
    case "newest":
      list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      break;
    case "featured":
    default:
      list.sort((a, b) => {
        const fa = fallbackProductsWithDetails.find((d) => d.id === a.id)?.featured ? 1 : 0;
        const fb = fallbackProductsWithDetails.find((d) => d.id === b.id)?.featured ? 1 : 0;
        return fb - fa || b.rating - a.rating;
      });
      break;
  }

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const items = list.slice(start, start + perPage);

  return { items, total, page, perPage, totalPages };
}

export function getFallbackFacets(categorySlug?: string) {
  const cards = categorySlug
    ? fallbackProductCards.filter((c) => c.category.slug === categorySlug)
    : fallbackProductCards;

  const sizeSet = new Set<string>();
  const colorMap = new Map<string, string>();

  for (const card of cards) {
    const full = fallbackProductsWithDetails.find((d) => d.id === card.id);
    if (!full) continue;
    for (const v of full.variants) {
      if (v.size) sizeSet.add(v.size);
      if (v.color && !colorMap.has(v.color)) {
        colorMap.set(v.color, v.colorHex ?? "#cccccc");
      }
    }
  }

  const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];
  const sizes = Array.from(sizeSet).sort((a, b) => {
    const ai = SIZE_ORDER.indexOf(a);
    const bi = SIZE_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  const colors = Array.from(colorMap.entries())
    .map(([name, hex]) => ({ name, hex }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return { sizes, colors };
}

export function getFallbackProductReviews(productId: string) {
  return [
    {
      id: "rev_1",
      productId,
      userId: "usr_1",
      rating: 5,
      title: "Superb craftsmanship and silhouette",
      body:
        "The fabric weight and cut are truly exceptional. Far exceeded expectations for everyday rotation.",
      verified: true,
      createdAt: new Date("2026-09-08T12:00:00.000Z"),
      user: { name: "Julian V." },
    },
    {
      id: "rev_2",
      productId,
      userId: "usr_2",
      rating: 5,
      title: "Modern classic",
      body: "Clean finishing, rich texture, and comfortable all day. Will definitely pick up another colorway.",
      verified: true,
      createdAt: new Date("2026-09-02T15:30:00.000Z"),
      user: { name: "Elena R." },
    },
  ];
}
