export type ProductType = {
  id: number;
  name: string;
  slug: string;
  category: string;
  thumbnail: {
    url: string;
    alt: string;
  };
  images: {
    url: string;
    alt: string;
  }[];
  rating: number;
  pricing: {
    original: number;
    sale: number | null;
    discountPercent: number | null;
  };
  stock: {
    quantity: number;
    status: string;
  };
  quality: string;
  description: string;
  sku: string;
  status: string;
};
