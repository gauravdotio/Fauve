import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const img = (id: string) => `https://images.unsplash.com/${id}`;
const DAY = 24 * 60 * 60 * 1000;

type Color = readonly [name: string, hex: string];

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
} satisfies Record<string, Color>;

type SeedVariant = { size?: string; color?: string; colorHex?: string; stock: number };

const v = (size: string, [color, colorHex]: Color, stock: number): SeedVariant => ({ size, color, colorHex, stock });
const o = ([color, colorHex]: Color, stock: number): SeedVariant => ({ color, colorHex, stock });

type SeedProduct = {
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  brand?: string;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  daysAgo: number;
  material: string;
  careInstructions: string;
  images: string[];
  variants: SeedVariant[];
};

type SeedCategory = {
  name: string;
  slug: string;
  description: string;
  image: string;
  products: SeedProduct[];
};

const CATEGORIES: SeedCategory[] = [
  {
    name: "Outerwear",
    slug: "outerwear",
    description:
      "Structured coats and jackets built for transitional weather, cut from weather-resistant wool and technical cotton.",
    image: img("photo-1539533113208-f6df8cc8b543"),
    products: [
      {
        name: "Overcast Wool Coat",
        slug: "overcast-wool-coat",
        sku: "FV-OC-001",
        shortDescription: "A double-faced wool coat with a clean, architectural silhouette.",
        description:
          "Cut from a heavyweight double-faced wool, the Overcast Coat is built for the in-between seasons — structured enough to hold its shape, soft enough to live in. A concealed placket and dropped shoulder keep the front uninterrupted, while an interior chest pocket keeps essentials close. Wear it open over knitwear, or buttoned to the collar on colder days.",
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
          v("S", C.camel, 5),
          v("M", C.camel, 9),
          v("L", C.camel, 0),
          v("S", C.charcoal, 8),
          v("M", C.charcoal, 12),
          v("L", C.charcoal, 6),
        ],
      },
      {
        name: "Waxed Field Jacket",
        slug: "waxed-field-jacket",
        sku: "FV-OC-002",
        shortDescription: "Waxed cotton jacket with a corduroy collar, built to weather the elements.",
        description:
          "A field jacket in waxed organic cotton, finished with a corduroy under-collar and brass hardware. Four bellows pockets add real storage without adding bulk, and the wax finish develops a natural patina with wear. Built for daily rotation through wind, rain, and everything in between.",
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
        variants: [v("S", C.olive, 10), v("M", C.olive, 14), v("L", C.olive, 7), v("M", C.black, 11), v("L", C.black, 4)],
      },
      {
        name: "Storm Shell Parka",
        slug: "storm-shell-parka",
        sku: "FV-OC-003",
        shortDescription: "A seam-sealed 3-layer parka with a removable quilted liner.",
        description:
          "Engineered from a taped-seam 3-layer shell, the Storm Parka is fully seam-sealed and built to withstand sustained rain. A removable quilted liner adds warmth without changing the fit, and an adjustable storm hood keeps visibility clear in high wind. The kind of coat you stop checking the forecast for.",
        price: 32900,
        compareAtPrice: 38900,
        rating: 4.7,
        reviewCount: 63,
        daysAgo: 3,
        material: "Recycled nylon shell, removable recycled-polyester liner",
        careInstructions: "Machine wash cold, hang dry",
        images: [img("photo-1588202449437-1417d91f2ceb"), img("photo-1537221468392-f0e27be14323")],
        variants: [v("S", C.navy, 6), v("M", C.navy, 9), v("L", C.navy, 5), v("M", C.black, 8), v("L", C.black, 3)],
      },
    ],
  },
  {
    name: "Knitwear",
    slug: "knitwear",
    description: "Fine-gauge knits in merino, cotton, and cashmere blends — layering pieces designed to outlast a season.",
    image: img("photo-1580331451062-99ff652288d7"),
    products: [
      {
        name: "Merino Crewneck Sweater",
        slug: "merino-crewneck-sweater",
        sku: "FV-KN-001",
        shortDescription: "A 14-gauge merino crewneck with a soft, breathable hand-feel.",
        description:
          "Knitted from extra-fine merino wool in a 14-gauge construction, this crewneck sits between a t-shirt and a heavier knit — light enough to layer, warm enough to wear alone. A ribbed collar, cuff, and hem hold their shape wash after wash.",
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
          v("XS", C.oatmeal, 7),
          v("S", C.oatmeal, 13),
          v("M", C.oatmeal, 18),
          v("L", C.oatmeal, 9),
          v("S", C.charcoal, 10),
          v("M", C.charcoal, 15),
          v("M", C.navy, 12),
          v("L", C.navy, 6),
        ],
      },
      {
        name: "Cable Knit Cardigan",
        slug: "cable-knit-cardigan",
        sku: "FV-KN-002",
        shortDescription: "A chunky cable-knit cardigan with horn buttons and patch pockets.",
        description:
          "A heavyweight cardigan knit in a traditional cable pattern, finished with natural horn buttons and dual patch pockets. A wool-cotton blend keeps it warm without the itch, making it as suited to a home office as a weekend walk.",
        price: 15900,
        rating: 4.5,
        reviewCount: 58,
        daysAgo: 120,
        material: "70% wool, 30% cotton",
        careInstructions: "Hand wash cold, dry flat",
        images: [img("photo-1581497396202-5645e76a3a8e"), img("photo-1634901581982-6b408cf4226a")],
        variants: [v("S", C.camel, 4), v("M", C.camel, 8), v("L", C.camel, 5), v("M", C.forest, 7), v("L", C.forest, 3)],
      },
      {
        name: "Cashmere Blend Turtleneck",
        slug: "cashmere-blend-turtleneck",
        sku: "FV-KN-003",
        shortDescription: "A featherweight cashmere-cotton turtleneck for year-round layering.",
        description:
          "A turtleneck spun from a cashmere-cotton blend that stays light enough for three-season wear. The fine gauge layers cleanly under a coat or blazer, and a slightly relaxed neck avoids the too-tight collar of most turtlenecks.",
        price: 18900,
        compareAtPrice: 22900,
        rating: 4.7,
        reviewCount: 96,
        featured: true,
        daysAgo: 6,
        material: "60% cotton, 40% cashmere",
        careInstructions: "Dry clean recommended",
        images: [img("photo-1610901157620-340856d0a50f"), img("photo-1603906650843-b58e94d9df4d")],
        variants: [v("S", C.black, 9), v("M", C.black, 14), v("L", C.black, 6), v("M", C.grey, 10), v("L", C.grey, 5)],
      },
    ],
  },
  {
    name: "Shirts & Tops",
    slug: "shirts-tops",
    description: "Poplin shirts and heavyweight jersey with a considered fit, made from long-staple cotton and linen.",
    image: img("photo-1602810318383-e386cc2a3ccf"),
    products: [
      {
        name: "Oxford Poplin Shirt",
        slug: "oxford-poplin-shirt",
        sku: "FV-SH-001",
        shortDescription: "A crisp poplin shirt with a soft button-down collar.",
        description:
          "Woven from long-staple cotton poplin, this shirt holds a crisp finish through repeated washing. A soft button-down collar and single chest pocket keep the design quiet, and a gently tapered body avoids excess fabric at the waist.",
        price: 8900,
        rating: 4.6,
        reviewCount: 174,
        featured: true,
        daysAgo: 75,
        material: "100% long-staple cotton",
        careInstructions: "Machine wash cold, iron on low",
        images: [img("photo-1624835567150-0c530a20d8cc"), img("photo-1620012253295-c15cc3e65df4"), img("photo-1604695573706-53170668f6a6")],
        variants: [
          v("S", C.sky, 12),
          v("M", C.sky, 18),
          v("L", C.sky, 9),
          v("S", C.white, 20),
          v("M", C.white, 25),
          v("L", C.white, 15),
          v("M", C.stone, 10),
          v("L", C.stone, 7),
        ],
      },
      {
        name: "Heavyweight Pocket Tee",
        slug: "heavyweight-pocket-tee",
        sku: "FV-SH-002",
        shortDescription: "A 240gsm cotton tee with a boxy, considered fit.",
        description:
          "Built from 240gsm combed cotton, this tee has enough weight to hold its shape and drape rather than cling. A single chest pocket and dropped shoulder seam give it a slightly boxy, off-duty fit that layers well under knitwear.",
        price: 4500,
        rating: 4.8,
        reviewCount: 203,
        daysAgo: 150,
        material: "100% combed cotton",
        careInstructions: "Machine wash cold",
        images: [img("photo-1581655353564-df123a1eb820"), img("photo-1521572163474-6864f9cf17ab")],
        variants: [
          v("XS", C.white, 15),
          v("S", C.white, 22),
          v("M", C.white, 28),
          v("L", C.white, 14),
          v("M", C.black, 19),
          v("M", C.sage, 11),
          v("L", C.sage, 6),
        ],
      },
      {
        name: "Linen Band-Collar Shirt",
        slug: "linen-band-collar-shirt",
        sku: "FV-SH-003",
        shortDescription: "A relaxed European linen shirt with a minimal band collar.",
        description:
          "Garment-washed European linen gives this shirt a soft, lived-in texture from the first wear. A band collar and hidden placket keep it clean enough to tuck in, relaxed enough to wear open over a tee on warm evenings.",
        price: 9900,
        rating: 4.4,
        reviewCount: 41,
        daysAgo: 15,
        material: "100% European linen",
        careInstructions: "Machine wash cold, line dry",
        images: [img("photo-1627686011747-74adda3d2343"), img("photo-1621072156002-e2fccdc0b176")],
        variants: [v("S", C.ecru, 8), v("M", C.ecru, 11), v("L", C.ecru, 5), v("M", C.sage, 9), v("L", C.sage, 0)],
      },
    ],
  },
  {
    name: "Trousers & Denim",
    slug: "trousers-denim",
    description: "Tailored trousers and selvedge denim, finished with a clean, modern silhouette.",
    image: img("photo-1584184924103-e310d9dc82fc"),
    products: [
      {
        name: "Tapered Wool Trousers",
        slug: "tapered-wool-trousers",
        sku: "FV-TR-001",
        shortDescription: "Mid-weight wool trousers with a tapered leg and clean front.",
        description:
          "Tailored from a mid-weight wool suiting fabric, these trousers hold a sharp crease and taper cleanly from knee to ankle. A hidden extendable waistband adds comfort without disrupting the flat-front finish.",
        price: 14900,
        rating: 4.6,
        reviewCount: 77,
        featured: true,
        daysAgo: 55,
        material: "98% wool, 2% elastane",
        careInstructions: "Dry clean only",
        images: [img("photo-1619470148547-0adbfc64b595"), img("photo-1611937669166-be4e0503b115")],
        variants: [v("S", C.stone, 12), v("M", C.stone, 16), v("L", C.stone, 5), v("M", C.charcoal, 10), v("L", C.charcoal, 8)],
      },
      {
        name: "Selvedge Straight Jean",
        slug: "selvedge-straight-jean",
        sku: "FV-TR-002",
        shortDescription: "13oz Japanese selvedge denim in a straight, rigid indigo.",
        description:
          "Woven on a vintage shuttle loom from 13oz Japanese cotton, this straight-leg jean is built to break in and fade with wear. A non-stretch construction and chain-stitched hem give it the structure denim purists look for.",
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
          v("30", C.indigo, 9),
          v("32", C.indigo, 15),
          v("34", C.indigo, 11),
          v("36", C.indigo, 6),
          v("32", C.black, 8),
          v("34", C.black, 5),
        ],
      },
      {
        name: "Pleated Chino",
        slug: "pleated-chino",
        sku: "FV-TR-003",
        shortDescription: "A relaxed double-pleat chino in brushed cotton twill.",
        description:
          "A double-pleated chino cut with a roomier thigh and tapered ankle, in a brushed cotton twill that softens with every wash. Side seam and back welt pockets keep the front clean.",
        price: 10900,
        rating: 4.3,
        reviewCount: 34,
        daysAgo: 130,
        material: "100% brushed cotton twill",
        careInstructions: "Machine wash cold",
        images: [img("photo-1473966968600-fa801b869a1a"), img("photo-1584865288642-42078afe6942")],
        variants: [v("S", C.khaki, 10), v("M", C.khaki, 14), v("L", C.khaki, 7), v("M", C.navy, 9)],
      },
    ],
  },
  {
    name: "Footwear",
    slug: "footwear",
    description: "Minimal sneakers and leather boots built on comfort-first lasts.",
    image: img("photo-1542490757-abcb453d75d9"),
    products: [
      {
        name: "Court Leather Sneaker",
        slug: "court-leather-sneaker",
        sku: "FV-FW-001",
        shortDescription: "A minimal court sneaker in full-grain leather with a cushioned cupsole.",
        description:
          "A clean-lined court sneaker built from full-grain leather over a cushioned cupsole. Minimal branding and a low profile make it as comfortable with tailoring as with denim.",
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
          v("40", C.white, 12),
          v("41", C.white, 16),
          v("42", C.white, 18),
          v("43", C.white, 10),
          v("42", C.black, 9),
          v("43", C.black, 6),
        ],
      },
      {
        name: "Suede Desert Boot",
        slug: "suede-desert-boot",
        sku: "FV-FW-002",
        shortDescription: "A crepe-soled desert boot in soft, water-resistant suede.",
        description:
          "A classic two-eyelet desert boot built on a natural crepe sole that grows more flexible with age. Soft suede uppers and a full leather lining make it as easy to wear in as it is to look at.",
        price: 19900,
        rating: 4.6,
        reviewCount: 118,
        daysAgo: 85,
        material: "Suede upper, crepe rubber sole",
        careInstructions: "Brush clean; treat with suede protector",
        images: [img("photo-1674293600869-c4aee0c9051f"), img("photo-1616688577198-0462bcecbdf9")],
        variants: [v("40", C.sand, 8), v("41", C.sand, 11), v("42", C.sand, 13), v("42", C.chocolate, 7), v("43", C.chocolate, 4)],
      },
      {
        name: "Minimal Runner",
        slug: "minimal-runner",
        sku: "FV-FW-003",
        shortDescription: "A low-profile knit runner built for all-day comfort.",
        description:
          "An engineered knit upper wraps the foot with no seams at the pressure points, mounted on a lightweight EVA midsole. Built as an everyday runner rather than a performance shoe — quiet colorways, maximum comfort.",
        price: 15900,
        compareAtPrice: 19900,
        rating: 4.5,
        reviewCount: 89,
        daysAgo: 9,
        material: "Engineered knit upper, EVA midsole",
        careInstructions: "Machine wash cold, air dry",
        images: [img("photo-1639572600664-28a2a01ce860"), img("photo-1639572604550-7b958a14eaa9")],
        variants: [v("40", C.white, 14), v("41", C.white, 17), v("42", C.white, 20), v("42", C.grey, 15), v("43", C.grey, 0)],
      },
    ],
  },
  {
    name: "Bags & Accessories",
    slug: "bags-accessories",
    description: "Full-grain leather bags and everyday accessories, built to age well.",
    image: img("photo-1535120927584-0230f40fc1e2"),
    products: [
      {
        name: "Full-Grain Weekender",
        slug: "full-grain-weekender",
        sku: "FV-BA-001",
        shortDescription: "A full-grain leather weekender with solid brass hardware.",
        description:
          "Built from vegetable-tanned full-grain leather over a structured base, the Weekender holds its shape whether it's empty or full. A detachable shoulder strap and interior zip pocket round out a bag meant to be used for decades, not seasons.",
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
        variants: [o(C.cognac, 6), o(C.black, 9)],
      },
      {
        name: "Structured Tote",
        slug: "structured-tote",
        sku: "FV-BA-002",
        shortDescription: "A structured leather tote sized for a 15-inch laptop.",
        description:
          "A work tote with a rigid base and structured sides that keep their shape unloaded. Fits a 15-inch laptop in a padded interior sleeve, with two slip pockets for a phone and keys.",
        price: 21900,
        rating: 4.6,
        reviewCount: 54,
        daysAgo: 110,
        material: "Full-grain leather, cotton canvas lining",
        careInstructions: "Wipe clean; condition occasionally",
        images: [img("photo-1624687943971-e86af76d57de"), img("photo-1637759292654-a12cb2be085e")],
        variants: [o(C.tan, 7), o(C.black, 10)],
      },
      {
        name: "Leather Card Holder",
        slug: "leather-card-holder",
        sku: "FV-BA-003",
        shortDescription: "A slim four-card holder in vegetable-tanned leather.",
        description:
          "A minimal card holder cut from a single piece of vegetable-tanned leather, hand-folded and edge-burnished. Holds up to four cards and folded cash without adding bulk to a pocket.",
        price: 5900,
        rating: 4.7,
        reviewCount: 129,
        daysAgo: 160,
        material: "Vegetable-tanned leather",
        careInstructions: "Wipe clean; condition occasionally",
        images: [img("photo-1627123424574-724758594e93"), img("photo-1560472355-536de3962603")],
        variants: [o(C.cognac, 18), o(C.black, 25)],
      },
    ],
  },
  {
    name: "Home & Living",
    slug: "home-living",
    description: "Considered objects for the table and the shelf — ceramics, candles, and linen.",
    image: img("photo-1583847268964-b28dc8f51f92"),
    products: [
      {
        name: "Hand-Thrown Stoneware Mug",
        slug: "hand-thrown-stoneware-mug",
        sku: "FV-HM-001",
        shortDescription: "A hand-thrown stoneware mug with a matte speckled glaze.",
        description:
          "Each mug is thrown on the wheel and finished with a matte speckled glaze, so no two are identical. Holds 12oz and is microwave and dishwasher safe, though hand-washing keeps the glaze truest over time.",
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
        variants: [o(C.sand, 30), o(C.slate, 22)],
      },
      {
        name: "Stonewashed Linen Throw",
        slug: "stonewashed-linen-throw",
        sku: "FV-HM-002",
        shortDescription: "A stonewashed European linen throw for the sofa or bed.",
        description:
          "Woven from European flax and stonewashed for a soft, relaxed hand from the first use. Generously sized for a sofa or the foot of a bed, with a simple hemmed edge that looks better the more it's used.",
        price: 8900,
        rating: 4.5,
        reviewCount: 38,
        daysAgo: 95,
        material: "100% European linen",
        careInstructions: "Machine wash cold, line dry",
        images: [img("photo-1705290304352-4beef0b626b3"), img("photo-1631679706909-1844bbd07221")],
        variants: [o(C.natural, 20), o(C.charcoal, 14)],
      },
      {
        name: "Cedar & Sage Candle",
        slug: "cedar-sage-candle",
        sku: "FV-HM-003",
        shortDescription: "A hand-poured soy candle in cedar, sage, and dried moss.",
        description:
          "Hand-poured in small batches using a coconut-soy wax blend and a cotton wick. The scent opens with sage and dries down to cedar and moss, with an approximate burn time of 45 hours.",
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
    name: "Fragrance & Grooming",
    slug: "fragrance-grooming",
    description: "Small-batch fragrance and grooming essentials with a restrained, woody palette.",
    image: img("photo-1622618991746-fe6004db3a47"),
    products: [
      {
        name: "Eau de Parfum No. 02",
        slug: "eau-de-parfum-no-02",
        sku: "FV-FR-001",
        shortDescription: "A woody, grounded fragrance built around vetiver and cedar.",
        description:
          "No. 02 opens with bergamot and black pepper, settles into a heart of vetiver and cedar, and dries down to a warm base of amber and musk. Formulated at 20% concentration for lasting wear through the day.",
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
      {
        name: "Sandalwood Beard Oil",
        slug: "sandalwood-beard-oil",
        sku: "FV-FR-002",
        shortDescription: "A lightweight beard oil with sandalwood and jojoba.",
        description:
          "A fast-absorbing blend of jojoba, argan, and vitamin E oils, scented with sandalwood and a trace of cedarwood. Softens and conditions without leaving a greasy finish.",
        price: 3200,
        rating: 4.6,
        reviewCount: 91,
        daysAgo: 140,
        material: "Jojoba oil, argan oil, sandalwood extract — 30ml",
        careInstructions: "Store away from direct sunlight",
        images: [img("photo-1620018646973-e3e257a1002c"), img("photo-1655241406159-78b405cebb0c")],
        variants: [{ stock: 4 }],
      },
      {
        name: "Charcoal Bar Soap Set",
        slug: "charcoal-bar-soap-set",
        sku: "FV-FR-003",
        shortDescription: "A set of three cold-processed botanical bar soaps.",
        description:
          "Cold-processed with activated charcoal, shea butter, and essential oils, this set of three bars gently exfoliates while cleansing. Free of sulfates and synthetic fragrance, finished in an unbleached kraft wrap.",
        price: 2800,
        rating: 4.4,
        reviewCount: 47,
        daysAgo: 170,
        material: "Activated charcoal, shea butter, essential oils",
        careInstructions: "Keep dry between uses",
        images: [img("photo-1600857544200-b2f666a9a2ec"), img("photo-1607006344380-b6775a0824a7")],
        variants: [{ stock: 0 }],
      },
    ],
  },
];

async function main() {
  if (process.argv.includes("--if-empty") && (await prisma.category.count()) > 0) {
    console.log("Database already seeded — skipping.");
    return;
  }

  console.log("Seeding database...");

  await prisma.$transaction([
    prisma.productVariant.deleteMany(),
    prisma.productImage.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
  ]);

  for (const [categoryIndex, category] of CATEGORIES.entries()) {
    const createdCategory = await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        position: categoryIndex + 1,
      },
    });

    for (const product of category.products) {
      await prisma.product.create({
        data: {
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          description: product.description,
          shortDescription: product.shortDescription,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          brand: product.brand ?? "Fauve",
          rating: product.rating,
          reviewCount: product.reviewCount,
          featured: product.featured ?? false,
          material: product.material,
          careInstructions: product.careInstructions,
          stock: product.variants.reduce((sum, variant) => sum + variant.stock, 0),
          createdAt: new Date(Date.now() - product.daysAgo * DAY),
          categoryId: createdCategory.id,
          images: {
            create: product.images.map((url, index) => ({
              url,
              alt: index === 0 ? product.name : `${product.name}, alternate view ${index}`,
              position: index,
            })),
          },
          variants: {
            create: product.variants.map((variant, index) => ({ ...variant, sku: `${product.sku}-${index + 1}` })),
          },
        },
      });
    }
  }

  const [adminPasswordHash, customerPasswordHash] = await Promise.all([
    bcrypt.hash("admin12345", 10),
    bcrypt.hash("customer12345", 10),
  ]);

  await prisma.user.upsert({
    where: { email: "admin@fauve.example.com" },
    update: {},
    create: { email: "admin@fauve.example.com", name: "Fauve Admin", passwordHash: adminPasswordHash, role: "ADMIN" },
  });

  await prisma.user.upsert({
    where: { email: "customer@fauve.example.com" },
    update: {},
    create: { email: "customer@fauve.example.com", name: "Test Customer", passwordHash: customerPasswordHash, role: "CUSTOMER" },
  });

  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: { code: "WELCOME10", type: "PERCENT", value: 10, minSubtotal: 0, active: true },
  });

  const [categoryCount, productCount] = await Promise.all([prisma.category.count(), prisma.product.count()]);
  console.log(`Seeded ${categoryCount} categories and ${productCount} products.`);
  console.log("Admin login: admin@fauve.example.com / admin12345");
  console.log("Customer login: customer@fauve.example.com / customer12345");
  console.log("Coupon: WELCOME10 (10% off)");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
