export type SeedReview = {
  author: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  daysAgo: number;
};

export type SeedProduct = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  collection: string;
  images: string[];
  sizes: string[];
  colors: string[];
  details: string[];
  featured?: boolean;
  isNew?: boolean;
  bestSeller?: boolean;
  stock?: number;
  reviews: SeedReview[];
};

const P = "https://images.pexels.com/photos";
const img = (id: number) =>
  `${P}/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1400&w=933`;

const APPAREL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const HAT_SIZES = ["One Size"];
const SHOE_SIZES = ["7", "8", "9", "10", "11", "12"];

export const CATEGORIES = [
  "Hoodies",
  "T-Shirts",
  "Jackets",
  "Pants",
  "Headwear",
  "Footwear",
] as const;

export const COLLECTIONS = [
  "Vault 01",
  "Static",
  "Terrain",
  "Relay",
  "Apex",
] as const;

export const seedProducts: SeedProduct[] = [
  {
    slug: "vault-heavyweight-hoodie-black",
    name: "Vault Heavyweight Hoodie",
    tagline: "480 GSM boxy-fit fleece",
    description: "The cornerstone of the Vault line. Cut from 480 GSM loop-back cotton with a heavyweight drape that only gets better with wear. Dropped shoulders, a boxy body and a double-lined hood built to hold its shape season after season.",
    price: 14800,
    compareAtPrice: 18000,
    category: "Hoodies",
    collection: "Vault 01",
    images: [img(28701960), img(15127546), img(21356439)],
    sizes: APPAREL_SIZES,
    colors: ["Onyx", "Bone", "Slate"],
    details: [
      "480 GSM heavyweight loop-back cotton",
      "Boxy relaxed fit with dropped shoulders",
      "Double-lined hood with flat drawcords",
      "Ribbed cuffs and hem",
      "Garment-dyed for a lived-in tone",
    ],
    featured: true,
    bestSeller: true,
    reviews: [
      {
        author: "Marcus T.",
        rating: 5,
        title: "The last hoodie you'll buy",
        body: "Ridiculously heavy in the best way. The fabric feels premium and the boxy cut sits perfectly over a tee. Washed it three times, zero shrink.",
        verified: true,
        daysAgo: 6,
      },
      {
        author: "Devon K.",
        rating: 5,
        title: "Worth every cent",
        body: "I own four hoodies from big brands and this beats all of them. The hood actually stays up.",
        verified: true,
        daysAgo: 21,
      },
      {
        author: "Priya S.",
        rating: 4,
        title: "Great, size down",
        body: "Love the weight. It's genuinely oversized so I went from M to S and it's perfect.",
        verified: true,
        daysAgo: 40,
      },
    ],
  },
  {
    slug: "static-pullover-hoodie-bone",
    name: "Static Pullover Hoodie",
    tagline: "Washed cotton, tonal print",
    description: "A softer everyday pullover from the Static capsule. Mid-weight brushed-back fleece with a subtle tonal chest print and a relaxed hood. Your go-to for the in-between days.",
    price: 11800,
    category: "Hoodies",
    collection: "Static",
    images: [img(30283474), img(18398345), img(19225018)],
    sizes: APPAREL_SIZES,
    colors: ["Bone", "Washed Black", "Moss"],
    details: [
      "340 GSM brushed-back fleece",
      "Relaxed fit, true to size",
      "Tonal water-based chest print",
      "Kangaroo pocket with hidden pass-through",
    ],
    isNew: true,
    reviews: [
      {
        author: "Sam W.",
        rating: 5,
        title: "So soft",
        body: "The inside is like a cloud. Print is subtle and clean.",
        verified: true,
        daysAgo: 9,
      },
      {
        author: "Jordan L.",
        rating: 4,
        title: "Solid everyday hoodie",
        body: "Fit is relaxed but not huge. Bone color is a perfect off-white.",
        verified: true,
        daysAgo: 30,
      },
    ],
  },
  {
    slug: "core-boxy-tee-bone",
    name: "Core Boxy Tee",
    tagline: "240 GSM heavyweight jersey",
    description: "A perfected blank. Heavyweight 240 GSM jersey with a boxy body, wide ribbed collar and a clean hem. Structured enough to stand on its own, honest enough to layer forever.",
    price: 5400,
    category: "T-Shirts",
    collection: "Vault 01",
    images: [img(18398691), img(2451200), img(18398709)],
    sizes: APPAREL_SIZES,
    colors: ["Bone", "Onyx", "Clay", "Sage"],
    details: [
      "240 GSM combed ring-spun cotton",
      "Boxy fit with slightly cropped body",
      "Wide double-needle ribbed collar",
      "Pre-shrunk, garment-washed",
    ],
    featured: true,
    bestSeller: true,
    reviews: [
      {
        author: "Alex R.",
        rating: 5,
        title: "Best blank tee, period",
        body: "The weight and boxy cut are exactly right. Bought five.",
        verified: true,
        daysAgo: 4,
      },
      {
        author: "Nina P.",
        rating: 5,
        title: "Stands on its own",
        body: "Thick, structured, doesn't cling. Sage is beautiful.",
        verified: true,
        daysAgo: 18,
      },
    ],
  },
  {
    slug: "terrain-utility-jacket-olive",
    name: "Terrain Utility Jacket",
    tagline: "Water-resistant ripstop shell",
    description: "The anchor of the Terrain collection. A boxy utility overshirt-jacket in water-resistant ripstop, loaded with bellows pockets and finished with matte hardware. Built for the city and everything past it.",
    price: 24800,
    compareAtPrice: 29500,
    category: "Jackets",
    collection: "Terrain",
    images: [img(7880141), img(32517679), img(7880148)],
    sizes: APPAREL_SIZES,
    colors: ["Field Olive", "Onyx", "Sand"],
    details: [
      "Water-resistant cotton-nylon ripstop",
      "Four bellows cargo pockets",
      "Matte snap and zip hardware",
      "Adjustable hem drawcord",
      "Boxy relaxed fit",
    ],
    featured: true,
    bestSeller: true,
    reviews: [
      {
        author: "Owen B.",
        rating: 5,
        title: "Incredible jacket",
        body: "The pockets are functional and the fabric shrugs off light rain. Fit is perfect over a hoodie.",
        verified: true,
        daysAgo: 5,
      },
      {
        author: "Kai N.",
        rating: 5,
        title: "Instant favorite",
        body: "Hardware feels expensive. Olive is the move.",
        verified: true,
        daysAgo: 16,
      },
    ],
  },
  {
    slug: "terrain-cargo-pant-olive",
    name: "Terrain Cargo Pant",
    tagline: "Tapered utility silhouette",
    description: "Utility done right. A tapered cargo cut in durable ripstop with anchored bellows pockets, an elasticated back waist and adjustable ankle cinches. Moves with you, holds everything.",
    price: 13800,
    compareAtPrice: 16000,
    category: "Pants",
    collection: "Terrain",
    images: [img(30415877), img(15553981), img(33672363)],
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: ["Field Olive", "Onyx", "Sand"],
    details: [
      "Durable cotton ripstop",
      "Tapered leg with ankle cinch",
      "Six-pocket utility layout",
      "Half-elasticated back waistband",
    ],
    featured: true,
    bestSeller: true,
    reviews: [
      {
        author: "Luca G.",
        rating: 5,
        title: "Perfect taper",
        body: "So many cargos are baggy at the ankle. These taper clean and stack just right over sneakers.",
        verified: true,
        daysAgo: 10,
      },
      {
        author: "Ava R.",
        rating: 5,
        title: "Everyday pant",
        body: "Comfortable enough to travel in, sharp enough for the city.",
        verified: true,
        daysAgo: 27,
      },
    ],
  },
  {
    slug: "vault-beanie-onyx",
    name: "Vault Ribbed Beanie",
    tagline: "Merino-blend cuffed knit",
    description: "A dense ribbed beanie in a soft merino blend. Cuffed for a snug, structured fit with a woven tonal tab at the fold.",
    price: 4200,
    category: "Headwear",
    collection: "Vault 01",
    images: [img(7957209), img(9596577), img(17474889)],
    sizes: HAT_SIZES,
    colors: ["Onyx", "Bone", "Moss", "Amber"],
    details: [
      "Merino-acrylic ribbed knit",
      "Cuffed fit",
      "Woven tonal tab",
      "One size fits most",
    ],
    featured: true,
    reviews: [
      {
        author: "Sasha V.",
        rating: 5,
        title: "Soft, not itchy",
        body: "So many beanies itch — this one doesn't at all. Holds shape well.",
        verified: true,
        daysAgo: 11,
      },
      {
        author: "Tom E.",
        rating: 5,
        title: "Perfect fit",
        body: "Snug without being tight. Amber colorway is great.",
        verified: true,
        daysAgo: 29,
      },
    ],
  },
  {
    slug: "apex-low-sneaker-bone",
    name: "Apex Low Sneaker",
    tagline: "Leather upper, gum sole",
    description: "A clean court-inspired low top with a full-grain leather upper, cushioned insole and a natural gum outsole. Minimal branding, maximum wearability.",
    price: 15800,
    compareAtPrice: 18500,
    category: "Footwear",
    collection: "Apex",
    images: [img(18368099), img(12739973), img(18368120)],
    sizes: SHOE_SIZES,
    colors: ["Bone", "Onyx"],
    details: [
      "Full-grain leather upper",
      "Natural gum rubber outsole",
      "Cushioned OrthoLite-style insole",
      "Waxed cotton laces",
    ],
    featured: true,
    bestSeller: true,
    reviews: [
      {
        author: "Jules M.",
        rating: 5,
        title: "Comfortable + clean",
        body: "Leather is genuinely nice quality and the gum sole is comfy all day.",
        verified: true,
        daysAgo: 9,
      },
      {
        author: "Ray S.",
        rating: 4,
        title: "Great sneaker",
        body: "Runs slightly large, went half a size down. Love them.",
        verified: true,
        daysAgo: 31,
      },
    ],
  },
];
