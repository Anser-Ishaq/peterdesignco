import Image from 'next/image'
import React from 'react'
import CustomButton from '../ui/customButton/customButton'
const Services = () => {
    const servicesArr = [
        { id: 1, src: '/serviceIcon1.svg', title: 'Material Selection' },
        { id: 2, src: '/serviceIcon2.svg', title: 'space planning' },
        { id: 3, src: '/serviceIcon3.svg', title: '3D renderings' },
        { id: 4, src: '/serviceIcon4.svg', title: 'project management' },
    ]
    return (
        <div className="pt-[80px] md:pt-[140px] lg:mb-[140px]">
            <div className="relative w-full">
                <div className="hidden lg:block w-full min-h-[435px] relative">
                    <Image
                        src="/services-bg.svg"
                        alt="services bg"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="lg:absolute inset-0 bg-[url('/services-bg.svg')] bg-cover bg-center w-full py-14 lg:py-0">
                    <div className="container mx-auto px-4">
                        <div className=" lg:mt-[116px]">
                            <p className="text-base font-medium mb-5 text-white">SERVICES</p>
                            <p className="text-2xl md:text-4xl font-extralight mb-10 text-white">Our Services</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {servicesArr.map((item) => (
                                    <div key={item.id} className="flex flex-col justify-start items-start gap-[50px] bg-white px-5 pt-[60px] pb-[30px] shadow-2xl">
                                        <Image src={item.src} width={80} height={80} alt={item.title} className="" />
                                        <p className="font-semibold text-black text-xl">{item.title}</p>
                                        <CustomButton text="Let's Start" icon="/arrow-forward.svg" backgroundColor={'bg-transparent!'} border={'border-0'} padding={'px-0 py-3'} />
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Services
