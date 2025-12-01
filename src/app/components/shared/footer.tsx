import React from 'react'
import CustomInput from '../ui/customInput/customInput'
import CustomButton from '../ui/customButton/customButton'
import Image from 'next/image'

const Footer = () => {
    return (
        <div className='pt-6'>
            <div className="bg-[url('/footer-bg.svg')] bg-cover bg-center w-full -z-0">
                <div className='container mx-auto px-4 pt-[80px] md:pt-[140px] pb-[50px]'>
                    <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 text-white pb-[50px] gap-8">

                        {/* Column 1 */}
                        <div className="flex flex-col gap-4 text-base font-extralight">
                            <p className="font-bold text-base">Products</p>
                            <p>Products</p>
                            <p>Products</p>
                            <p>Products</p>
                            <p>Products</p>
                        </div>

                        {/* Column 2 */}
                        <div className="flex flex-col gap-4 text-base font-extralight">
                            <p className="font-bold text-base">Products</p>
                            <p>Products</p>
                            <p>Products</p>
                            <p>Products</p>
                            <p>Products</p>
                        </div>

                        {/* Column 3 */}
                        <div className="flex flex-col gap-4 text-base font-extralight">
                            <p className="font-bold text-base">Products</p>
                            <p>Products</p>
                            <p>Products</p>
                            <p>Products</p>
                            <p>Products</p>
                        </div>

                        {/* Subscribe — full width on small screens */}
                        <div className="col-span-2 md:col-span-1 flex flex-col gap-4 text-base font-extralight">
                            <p className="font-bold text-base">Subscribe</p>

                            <div className="flex gap-1.5">
                                <CustomInput
                                    backgroundColor="bg-white"
                                    height="h-[50px]"
                                    width="w-full"
                                    border="border border-dark-gray rounded-[6px]"
                                    placeholder="Email Address"
                                />
                                <CustomButton
                                    icon="/arrow-forward.svg"
                                    height="h-[50px]"
                                    width="w-[85px]"
                                    border="border border--dark-gold rounded-[6px]"
                                    backgroundColor="bg-dark-gold"
                                    padding="p-3"
                                />
                            </div>

                            <p>
                                Hello, we are Lift Media. Our goal is to translate the positive effects from
                                revolutionizing how companies engage with their clients & their team.
                            </p>
                        </div>

                    </div>

                    <div className='h-[1px] w-full bg-dark-gray'></div>
                    <div className='text-white flex flex-col gap-5 md:gap-0 md:flex-row justify-center md:justify-between items-start md:items-center pt-[30px]'>
                        <div className="relative flex flex-col gap-4">
                            <Image
                                src="/footer-logo.svg"
                                alt="Home Image"
                                height={80}
                                width={218}
                                className="object-cover"
                            />
                            <Image
                                src="/main.svg"
                                alt="Home Image"
                                height={100}
                                width={150}
                                className="object-cover invert"
                            />
                        </div>
                        <div className='flex gap-[40px]'>
                            <div>Terms</div>
                            <div>Privacy</div>
                            <div>Cookies</div>
                        </div>
                        <div className='relative flex gap-3.5'>
                            <Image
                                src="/Linkedin.svg"
                                alt="social"
                                height={35}
                                width={35}
                                className="object-cover"
                            />
                            <Image
                                src="/Twitter.svg"
                                alt="social"
                                height={35}
                                width={35}
                                className="object-cover"
                            />
                            <Image
                                src="/Facebook.svg"
                                alt="social"
                                height={35}
                                width={35}
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer
