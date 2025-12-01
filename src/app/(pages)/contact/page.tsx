import ContactForm from '@/app/components/shared/contactForm'
import Image from 'next/image'
import React from 'react'

const page = () => {
    return (
        <>
            {/* hero section */}
            <div className="relative w-full h-screen">
                <Image
                    src="/contact-bg.svg"
                    alt="contact Image"
                    fill
                    className="object-cover opacity-90"
                />
                <div className="absolute top-2/5 z-20 w-full flex flex-col gap-6 justify-center items-center text-white">
                    <p className="font-medium text-base">Contact us</p>
                    <p className="font-bold text-2xl lg:text-5xl text-center max-w-[800px]">Let's establish relations : )</p>
                </div>
            </div>

            <ContactForm />
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3405.293649331319!2d74.24487098606929!3d31.40603460791468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919010009c05b4d%3A0x553242b1e5c70b97!2sVertical%203!5e0!3m2!1sen!2s!4v1764617033636!5m2!1sen!2s" width="100%" height="600" style={{"border":0}} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </>
    )
}

export default page
