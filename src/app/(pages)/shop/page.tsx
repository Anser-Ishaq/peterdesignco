"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string;
  thumbnail: {
    url: string;
    alt: string;
  };
  rating: number;
  pricing: {
    original: number;
    sale: number | null;
    discountPercent: number | null;
  };
  stock: {
    quantity: number;
    status: "in_stock" | "low_stock" | "out_of_stock";
  };
  quality: "Basic" | "Standard" | "Premium" | "Luxury";
  description: string;
  sku: string;
  status: "active" | "inactive" | "draft";
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products?status=active&limit=50`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
      } else {
        setError(data.error || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full h-[440px] md:h-[600px] lg:h-[700px]">
        <Image
          src="/contact-bg.svg"
          alt="contact Image"
          fill
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 z-20 flex flex-col gap-6 justify-center items-center text-white px-4">
          <p className="font-medium text-base">BEST PRODUCTS</p>
          <p className="font-bold text-2xl lg:text-5xl text-center max-w-[800px]">
            An Amazing Collection Modern Furniture
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 pt-[140px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product._id} href={`/shop/${product.slug}`}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative h-64 bg-gray-200">
                  {product.thumbnail?.url ? (
                    <Image
                      src={product.thumbnail.url}
                      alt={product.thumbnail.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No Image
                    </div>
                  )}

                  {/* Sale Badge */}
                  {product.pricing.sale && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                      Save {product.pricing.discountPercent}%
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg truncate flex-1">
                      {product.name}
                    </h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium ml-2 bg-blue-100 text-blue-600">
                      {product.quality}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-gold">
                        Rs.{product.pricing.sale || product.pricing.original}
                      </span>
                      {product.pricing.sale && (
                        <span className="text-sm text-gray-500 line-through">
                          Rs.{product.pricing.original}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-gray-600">
                        {product.rating}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      SKU: {product.sku}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock.status === "in_stock"
                          ? "bg-green-100 text-green-600"
                          : product.stock.status === "low_stock"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {product.stock.quantity} in stock
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
