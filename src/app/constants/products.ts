export const products = [
  {
    id: 1,
    name: "Wooden Chair",
    slug: "wooden-chair",
    category: "furniture",

    thumbnail: {
      url: "/product2.png",
      alt: "Wooden chair thumbnail",
    },

    images: [
      { url: "/product2.png", alt: "Wooden chair front view" },
      { url: "/product2.png", alt: "Wooden chair side view" },
      { url: "/product2.png", alt: "Wooden chair back view" },
    ],

    rating: 5,

    pricing: {
      original: 50000,
      sale: 42000,
      discountPercent: 16,
    },

    stock: {
      quantity: 12,
      status: "in_stock",
    },

    quality: "Premium",
    description:
      "Premium quality wooden chair made with solid wood and a modern ergonomic design.",

    sku: "CHAIR-WD-001",
    status: "active",
  },

  {
    id: 2,
    name: "Modern Office Chair",
    slug: "modern-office-chair",
    category: "office",

    thumbnail: {
      url: "/product2.png",
      alt: "Office chair thumbnail",
    },

    images: [
      { url: "/product2.png", alt: "Office chair front view" },
      { url: "/product2.png", alt: "Office chair side view" },
    ],

    rating: 4.5,

    pricing: {
      original: 65000,
      sale: null,
      discountPercent: null,
    },

    stock: {
      quantity: 8,
      status: "in_stock",
    },

    quality: "Standard",
    description:
      "Comfortable modern office chair with adjustable height and lumbar support.",

    sku: "CHAIR-OFF-002",
    status: "active",
  },

  {
    id: 3,
    name: "Luxury Sofa Chair",
    slug: "luxury-sofa-chair",
    category: "living-room",

    thumbnail: {
      url: "/product2.png",
      alt: "Luxury sofa chair thumbnail",
    },

    images: [
      { url: "/product2.png", alt: "Luxury sofa chair front view" },
      { url: "/product2.png", alt: "Luxury sofa chair side view" },
    ],

    rating: 4.8,

    pricing: {
      original: 120000,
      sale: 99000,
      discountPercent: 18,
    },

    stock: {
      quantity: 5,
      status: "low_stock",
    },

    quality: "Luxury",
    description:
      "Luxury sofa chair with premium fabric and high-density foam for maximum comfort.",

    sku: "SOFA-LUX-003",
    status: "active",
  },

  {
    id: 4,
    name: "Minimalist Dining Chair",
    slug: "minimalist-dining-chair",
    category: "dining",

    thumbnail: {
      url: "/product2.png",
      alt: "Dining chair thumbnail",
    },

    images: [
      { url: "/product2.png", alt: "Dining chair front view" },
      { url: "/product2.png", alt: "Dining chair side view" },
    ],

    rating: 4.2,

    pricing: {
      original: 38000,
      sale: 32000,
      discountPercent: 16,
    },

    stock: {
      quantity: 20,
      status: "in_stock",
    },

    quality: "Standard",
    description:
      "Minimalist dining chair with a sleek design, perfect for modern dining spaces.",

    sku: "CHAIR-DINE-004",
    status: "active",
  },
];
