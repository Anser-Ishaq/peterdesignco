"use client";
import CustomDropdown from "@/app/components/ui/customDropdown/customDropdown";
import { products } from "@/app/constants/products";
import Image from "next/image";
import Link from "next/link";
export default function Home() {
  const options = [
    "Price: Low to High",
    "Price: High to Low",
    "Most Popular",
    "Newest",
  ];
  return (
    <>
      {/* hero section */}
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

      <div className="container mx-auto px-4 pt-[80px] md:pt-[140px] pb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-[50px]">
          <p>Showing 1-8 of 9 Results</p>
          <CustomDropdown
            options={options}
            onSelect={(option) => console.log(option)}
          />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.slug}`}
              className="flex flex-col group cursor-pointer"
            >
              <div
                key={product.id}
                className="flex flex-col group cursor-pointer"
              >
                {/* Product Image */}
                <div className="relative w-full aspect-[288/355] mb-3 bg-gray overflow-hidden">
                  {product?.pricing?.sale && (
                    <div className="absolute top-[11px] right-[-21px] h-[20px] w-[87px] text-center flex justify-center items-center rotate-45 bg-red-500 text-white">
                      sale
                    </div>
                  )}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-all duration-500 ease-in-out z-10" />
                  <Image
                    src={product.thumbnail.url}
                    alt={product.thumbnail.alt}
                    fill
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                  />
                </div>

                {/* Product Name */}
                <h3 className="text-base md:text-xl font-medium text-center mb-2 transition-colors duration-300 group-hover:text-primary">
                  {product.name}
                </h3>

                {/* Rating */}
                {/* <div className="flex gap-1 mb-2 justify-center">
                    {[...Array(product.rating)].map((_, index) => (
                    <Image
                        key={index}
                        src="/star.svg"
                        alt="star"
                        width={16}
                        height={16}
                        className="md:w-5 md:h-5 transition-transform duration-300 group-hover:scale-110"
                    />
                    ))}
              </div> */}

                {/* Price */}
                <p className="text-base md:text-xl font-medium text-primary text-center transition-transform duration-300 group-hover:scale-105">
                  Rs {product.pricing.original}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
