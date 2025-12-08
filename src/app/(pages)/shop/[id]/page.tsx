'use client';
import Slider from "@/app/components/shared/slider";
import Counter from "@/app/components/ui/counter/counter";
import CustomButton from "@/app/components/ui/customButton/customButton";
import Image from "next/image";

export default function Home() {

    return (
        <>
            <div className="container mx-auto px-4 pt-[140px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-0">

                    <div>
                        <Slider
                            variant="image"
                            images={[
                                { id: 1, imgSrc: '/product2.png' },
                                { id: 2, imgSrc: '/product1.avif' },
                                { id: 3, imgSrc: '/product2.png' },
                            ]}
                            showThumbnails
                        /></div>
                    <div className="flex flex-col gap-3.5 lg:gap-7">
                        <p className="text-2xl md:text-5xl font-bold">Modern Item</p>
                        <p className="text-xl font-semibold">Premium</p>
                        <p>Stars</p>
                        <div className="flex gap-2 lg:gap-3.5 items-center">
                            <p className="text-xl lg:text-4xl font-semibold text-gold">Rs. 7000</p>
                            <p className="textlg lg:text-xl font-semibold text-dark-gray">Rs. 10,000</p>
                            <p className="bg-purple h-10 py-3 px-5 text-white rounded-full flex items-center">Save 3000</p>
                        </div>
                        <div className="flex gap-3.5 items-center w-full">
                            <Counter onChange={(value) => console.log('Quantity:', value)} />
                            <CustomButton text="CHECKOUT NOW" layout="w-full" width="w-full" height="h-[70px]" border="border border-gold rounded-lg" />
                        </div>
                        <div className="flex  flex-col md:flex-row justify-between items-center">
                            <div className="flex flex-col md:flex-row gap-2 items-center">
                                <Image src='/productDescIcon2.svg' alt="desc icon" width={70} height={70} />
                                <p>Order Before Arrival</p>
                            </div>
                            <div className="flex flex-col md:flex-row gap-2 items-center">
                                <Image src='/productDescIcon1.svg' alt="desc icon" width={70} height={70} />

                                <p>Fast action to deliver to house</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-7">
                            <p className="text-xl md:text-3xl font-medium">Description</p>
                            <p className="text-base font-normal">Lorem ipsum dolor sit amet consectetur. Porta morbi tristique tincidunt tincidunt. Id hendrerit sit mauris quam elit. Scelerisque morbi pharetra hendrerit in quisque proin. Malesuada sed vitae vulputate nisi elementum eget.</p>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}