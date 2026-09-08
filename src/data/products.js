// Ethiopian Opal Specialist Store
// Products are sold by weight: gram (rough) or carat (crystal/polished).
// The model is extensible — future jewelry items (rings, necklaces, etc.)
// can be added with soldBy: null and a fixed price.
export const products = [
  {
    id: 1,
    name: "Rough Opal",
    type: "Rough Opal",
    category: "Opal Stones",
    soldBy: "gram",
    pricePerUnit: 25,
    availableWeights: [1, 2, 5, 10, 20],
    image: "/images/opal-rough.jpg?v=2",
    badge: "Bestseller",
    description: "Natural Ethiopian Welo opal in its raw form — untouched by polishing, revealing the stone's true fire. Perfect for collectors, lapidaries, and custom jewelry commissions.",
    origin: "Welo, Ethiopia",
    grade: "AA — Premium",
    sku: "MJ-OPL-RGH",
    stock: 500,
    lowStockThreshold: 50,
  },
  {
    id: 2,
    name: "Crystal Opal",
    type: "Crystal Opal",
    category: "Opal Stones",
    soldBy: "carat",
    pricePerUnit: 45,
    availableWeights: [1, 2, 3, 5],
    image: "/images/opal-crystal.jpg?v=2",
    badge: "Premium",
    description: "Transparent crystal opal with exceptional clarity and a brilliant play of color. The rarest and most prized of Ethiopian opals — each stone is hand-selected and certified.",
    origin: "Welo, Ethiopia",
    grade: "AA+ — Museum Grade",
    sku: "MJ-OPL-CRY",
    stock: 120,
    lowStockThreshold: 20,
  },
  {
    id: 3,
    name: "Polished Opal",
    type: "Polished Opal",
    category: "Opal Stones",
    soldBy: "carat",
    pricePerUnit: 35,
    availableWeights: [1, 2, 3, 5],
    image: "/images/opal-polished.jpg?v=2",
    badge: "New",
    description: "Cabochon-cut and hand-polished to a mirror finish, revealing every flash of fire. Ready to set into rings, pendants, earrings, or display as a collector's piece.",
    origin: "Welo, Ethiopia",
    grade: "A — Fine",
    sku: "MJ-OPL-POL",
    stock: 200,
    lowStockThreshold: 30,
  },
];

// Collection cards shown on the home page — mirrors the product types
export const collections = [
  {
    id: 1,
    name: "Rough Opal",
    description: "Raw Welo opal, sold by the gram",
    image: "/images/opal-rough.jpg?v=2"
  },
  {
    id: 2,
    name: "Crystal Opal",
    description: "Rare transparent fire, sold by the carat",
    image: "/images/opal-crystal.jpg?v=2"
  },
  {
    id: 3,
    name: "Polished Opal",
    description: "Cabochon finish, ready to set",
    image: "/images/opal-polished.jpg?v=2"
  },
];

// Derived dynamically so future jewelry categories appear automatically
export const categories = ["All", ...new Set(products.map(p => p.type))];