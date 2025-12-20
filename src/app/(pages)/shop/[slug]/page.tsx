"use client";
import Slider from "@/app/components/shared/slider";
import Counter from "@/app/components/ui/counter/counter";
import CustomButton from "@/app/components/ui/customButton/customButton";
import { products } from "@/app/constants/products";
import Image from "next/image";
import { useState, useEffect } from "react";
import type { ProductType } from "@/app/types/productType";

type Prop = {
  params: {
    slug: string;
  };
};

export default function Home({ params }: Prop) {
  const [productDetail, setProductDetail] = useState<ProductType | null>(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const param = await params;
        const findProducts = products.find((item) => item.slug == param.slug);
        console.log("findProdcuts", findProducts);
        setProductDetail(findProducts || null);
      } catch (error) {
        console.log("error", error);
        alert(error);
      }
    };
    getProducts();
  }, [params]);
  return (
    <>
      <div className="container mx-auto px-4 pt-[140px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-0">
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
                Rs.{productDetail?.pricing?.sale}
              </p>
              <p className="textlg lg:text-xl font-semibold text-dark-gray line-through">
                {productDetail?.pricing?.original}
              </p>
              {productDetail?.pricing?.discountPercent && (
                <p className="bg-purple h-10 py-3 px-5 text-white rounded-full flex items-center">
                  Save {productDetail?.pricing?.discountPercent}%
                </p>
              )}
            </div>
            <div className="flex gap-3.5 items-center w-full">
              <Counter onChange={(value) => console.log("Quantity:", value)} />
              <CustomButton
                text="CHECKOUT NOW"
                layout="w-full"
                width="w-full"
                height="h-[70px]"
                border="border border-gold rounded-lg"
              />
            </div>
            <div className="flex  flex-col md:flex-row justify-between items-center">
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
          </div>
        </div>
      </div>
    </>
  );
}
