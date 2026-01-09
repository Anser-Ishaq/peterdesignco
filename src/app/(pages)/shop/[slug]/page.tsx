"use client";
import Slider from "@/app/components/shared/slider";
import Counter from "@/app/components/ui/counter/counter";
import AddToCartButton from "@/app/components/shared/AddToCartButton";
import Image from "next/image";
import { useState, useEffect } from "react";

interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string;
  thumbnail: {
    url: string;
    alt: string;
  };
  images: Array<{
    url: string;
    alt: string;
  }>;
  rating: number;
  pricing: {
    original: number;
    sale: number | null;
    discountPercent: number | null;
  };
  stock: {
    quantity: number;
    status: 'in_stock' | 'low_stock' | 'out_of_stock';
  };
  quality: 'Basic' | 'Standard' | 'Premium' | 'Luxury';
  description: string;
  sku: string;
  status: 'active' | 'inactive' | 'draft';
}

type Prop = {
  params: Promise<{
    slug: string;
  }>;
};

export default function ProductDetailPage({ params }: Prop) {
  const [productDetail, setProductDetail] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        const resolvedParams = await params;
        
        // First get all products to find by slug
        const response = await fetch(`/api/products?status=active&limit=100`);
        const data = await response.json();
        
        if (data.success) {
          const foundProduct = data.data.find((item: Product) => item.slug === resolvedParams.slug);
          if (foundProduct) {
            setProductDetail(foundProduct);
          } else {
            setError("Product not found");
          }
        } else {
          setError(data.error || "Failed to fetch product");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };
    
    getProduct();
  }, [params]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-[140px] min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !productDetail) {
    return (
      <div className="container mx-auto px-4 pt-[140px] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Product not found"}</p>
          <a href="/shop" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Back to Shop
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 pt-[140px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-4">
          <div>
            <Slider
              variant="image"
              images={
                productDetail?.images?.map((img, index) => ({
                  id: index + 1,
                  imgSrc: img.url,
                  alt: img.alt,
                })) || []
              }
              showThumbnails
            />
          </div>
          <div className="flex flex-col gap-3.5 lg:gap-7">
            <p className="text-2xl md:text-5xl font-bold">
              {productDetail?.name}
            </p>
            <p className="text-xl font-semibold">{productDetail?.quality}</p>
            <div className="flex gap-2 lg:gap-3.5 items-center">
              <p className="text-xl lg:text-4xl font-semibold text-gold">
                Rs.{productDetail?.pricing?.sale || productDetail?.pricing?.original}
              </p>
              {productDetail?.pricing?.sale && (
                <>
                  <p className="text-lg lg:text-xl font-semibold text-dark-gray line-through">
                    Rs.{productDetail?.pricing?.original}
                  </p>
                  <p className="bg-purple h-10 py-3 px-5 text-white rounded-full flex items-center">
                    Save {productDetail?.pricing?.discountPercent}%
                  </p>
                </>
              )}
            </div>
            <div className="flex gap-3.5 items-center w-full">
              <Counter 
                onChange={(value) => setQuantity(value)} 
                max={productDetail.stock.quantity}
                initialValue={1}
              />
              <AddToCartButton
                productId={productDetail._id}
                productName={productDetail.name}
                stockQuantity={productDetail.stock.quantity}
                stockStatus={productDetail.stock.status}
                quantity={quantity}
                className="w-full h-[70px] border border-gold rounded-lg"
              />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex flex-col md:flex-row gap-2 items-center">
                <Image
                  src="/productDescIcon2.svg"
                  alt="desc icon"
                  width={70}
                  height={70}
                />
                <p>Order Before Arrival</p>
              </div>
              <div className="flex flex-col md:flex-row gap-2 items-center">
                <Image
                  src="/productDescIcon1.svg"
                  alt="desc icon"
                  width={70}
                  height={70}
                />
                <p>Fast action to deliver to house</p>
              </div>
            </div>
            <div className="flex flex-col gap-7">
              <p className="text-xl md:text-3xl font-medium">Description</p>
              <p className="text-base font-normal">
                {productDetail?.description}
              </p>
            </div>
            
            {/* Product Details */}
            <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">SKU:</span> {productDetail.sku}
                </div>
                <div>
                  <span className="font-medium">Category:</span> {productDetail.category}
                </div>
                <div>
                  <span className="font-medium">Stock:</span> {productDetail.stock.quantity} available
                </div>
                <div>
                  <span className="font-medium">Rating:</span> ⭐ {productDetail.rating}/5
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
