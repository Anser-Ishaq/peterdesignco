import React from 'react'
import CustomButton from '../ui/customButton/customButton'
import CustomInput from '../ui/customInput/customInput'
import CustomTextarea from '../ui/customTextarea/customTextarea'
const ContactForm = () => {
    return (
        <div className="bg-[url('/model-bg.svg')] bg-cover bg-center w-full bg-accent">
            <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="flex flex-col justify-start items-start">
                        <p className="text-base font-medium mb-5 text-black">Contact Us</p>
                        <p className="text-2xl md:text-4xl font-bold mb-10 text-black">Lets Start a New Project</p>
                        <p className="lg:w-90  font-normal text-xl mb-20">Now Lets Start a New Project Lets Start a New Project Lets Start a New Project Lets Start a New Project Lets Start a New Project Lets Start a New Project</p>
                        <div className="flex flex-col md:flex-row justify-between gap-20 font-normal text-xl">
                            <div>
                                <p>Phone Number</p>
                                <p>0313-1234567</p>
                                <p>0313-1234567</p>
                            </div>
                            <div>
                                <p>Email</p>
                                <p>itsme@design.com</p>
                                <p>itsme@design.com</p>
                            </div>

                        </div>

                    </div>
                    <div className="flex flex-col justify-between mt-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-5">
                            <CustomInput width="w-full" height="h-[50px]" placeholder="Name" />
                            <CustomInput width="w-full" height="h-[50px]" placeholder="Phone" />
                        </div>
                        <CustomInput width="w-full" height="h-[50px]" placeholder="Email" />
                        <CustomTextarea width="w-full" height="h-[150px]" placeholder="Message" />
                        <CustomButton text="Submit" icon="/arrow-forward.svg" />

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactForm
