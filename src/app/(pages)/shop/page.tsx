'use client'
import CustomDropdown from "@/app/components/ui/customDropdown/customDropdown";
import Image from "next/image";

export default function Home() {
    const products = [
        {
            id: 1,
            productName:'Chair',
            imgSrc: '/product2.png',
            rating: 5,
            price: '50,000'
        },
        {
            id: 2,
            productName:'Chair',
            imgSrc: '/product2.png',
            rating: 5,
            price: '50,000'
        },
        {
            id: 3,
            productName:'Chair',
            imgSrc: '/product2.png',
            rating: 5,
            price: '50,000'
        },
        {
            id: 4,
            productName:'Chair',
            imgSrc: '/product2.png',
            rating: 5,
            price: '50,000'
        },
        {
            id: 5,
            productName:'Chair',
            imgSrc: '/product2.png',
            rating: 5,
            price: '50,000'
        },
        {
            id: 6,
            productName:'Chair',
            imgSrc: '/product2.png',
            rating: 5,
            price: '50,000'
        },
        {
            id: 7,
            productName:'Chair',
            imgSrc: '/product2.png',
            rating: 5,
            price: '50,000'
        },
        {
            id: 8,
            productName:'Chair',
            imgSrc: '/product2.png',
            rating: 5,
            price: '50,000'
        },
    ]

    const options = ['Price: Low to High', 'Price: High to Low', 'Most Popular', 'Newest']
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
                    <p className="font-bold text-2xl lg:text-5xl text-center max-w-[800px]">An Amazing Collection Modern Furniture</p>
                </div>
            </div>

            <div className="container mx-auto px-4 pt-[80px] md:pt-[140px] pb-20">
                <div className="flex justify-between">
                    <p>Showing 1-8 of 9 Results</p>
                    <CustomDropdown options={options} onSelect={(option)=> console.log(option)}/>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                    {products.map((product) => (
                        <div key={product.id} className="flex flex-col">
                            {/* Product Image */}
                            <div className="relative w-full aspect-[288/355] mb-3 bg-gray">
                                <Image
                                    src={product.imgSrc}
                                    alt={product.productName}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            
                            {/* Product Name */}
                            <h3 className="text-sm md:text-lg font-semibold text-center mb-2">
                                {product.productName}
                            </h3>
                            
                            {/* Rating */}
                            <div className="flex gap-1 mb-2 justify-center">
                                {[...Array(product.rating)].map((_, index) => (
                                    <Image
                                        key={index}
                                        src="/star.svg"
                                        alt="star"
                                        width={16}
                                        height={16}
                                        className="md:w-5 md:h-5"
                                    />
                                ))}
                            </div>
                            
                            {/* Price */}
                            <p className="text-base md:text-xl font-bold text-primary text-center">
                                Rs {product.price}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
