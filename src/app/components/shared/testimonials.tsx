import React from 'react'
import Slider from './slider'
const Testimonials = () => {
    const testimonialsArr = [
        {
            id: 1,
            imgSrc: '/testimonial-1.svg',
            review: 'Peter Design Co. transformed our office into a modern and functional space. Their attention to detail and professionalism were outstanding.',
            name: 'John Doe',
            position: 'CEO, Company A',
            stars: 5
        },
        {
            id: 2,
            imgSrc: '/testimonial-1.svg',
            review: 'Peter Design Co. transformed our office into a modern and functional space. Their attention to detail and professionalism were outstanding.',
            name: 'John Doe',
            position: 'CEO, Company A',
            stars: 5
        },
        {
            id: 3,
            imgSrc: '/testimonial-1.svg',
            review: 'Peter Design Co. transformed our office into a modern and functional space. Their attention to detail and professionalism were outstanding.',
            name: 'John Doe',
            position: 'CEO, Company A',
            stars: 5
        },
        {
            id: 4,
            imgSrc: '/testimonial-1.svg',
            review: 'Peter Design Co. transformed our office into a modern and functional space. Their attention to detail and professionalism were outstanding.',
            name: 'John Doe',
            position: 'CEO, Company A',
            stars: 5
        },
        {
            id: 5,
            imgSrc: '/testimonial-1.svg',
            review: 'Peter Design Co. transformed our office into a modern and functional space. Their attention to detail and professionalism were outstanding.',
            name: 'John Doe',
            position: 'CEO, Company A',
            stars: 5
        },
        {
            id: 6,
            imgSrc: '/testimonial-1.svg',
            review: 'Peter Design Co. transformed our office into a modern and functional space. Their attention to detail and professionalism were outstanding.',
            name: 'John Doe',
            position: 'CEO, Company A',
            stars: 5
        },
    ]
    return (
        <div className="container mx-auto px-4 pt-[80px] md:pt-[140px]">
            <div>
                <div className="flex flex-col justify-center items-center">
                    <p className="text-base font-medium mb-5 text-black">TESTIMONIALS</p>
                    <p className="text-2xl md:text-4xl font-bold mb-10 text-black">What Our Client Say’s</p>
                </div>
                <div>
                    <Slider testimonialsArr={testimonialsArr} />

                </div>
            </div>
        </div>
    )
}

export default Testimonials
