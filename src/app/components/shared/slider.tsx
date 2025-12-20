'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Image from 'next/image';
import { useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';

type SliderVariant = 'testimonial' | 'image';
interface CommonSliderProps {
    variant: SliderVariant;
}

interface Testimonial {
    id: number;
    imgSrc: string;
    name: string;
    position: string;
    review: string;
    stars: number;
}

interface ImageItem {
    id: number;
    imgSrc: string;
    alt:string
}

interface TestimonialSliderProps extends CommonSliderProps {
    variant: 'testimonial';
    testimonials: Testimonial[];
}

interface ImageSliderProps extends CommonSliderProps {
    variant: 'image';
    images: ImageItem[];
    showThumbnails?: boolean;
}

type SliderProps = TestimonialSliderProps | ImageSliderProps;

const Slider = (props: SliderProps) => {
    const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleThumbnailClick = (index: number) => {
        if (swiperInstance) {
            swiperInstance.slideTo(index);
        }
    };

    const handlePrev = () => {
        if (swiperInstance) {
            swiperInstance.slidePrev();
        }
    };

    const handleNext = () => {
        if (swiperInstance) {
            swiperInstance.slideNext();
        }
    };

    return (
        <div className="w-full">
            <div className="relative group">
                <Swiper
                    spaceBetween={50}
                    slidesPerView={props.variant === 'testimonial' ? 3 : 1}
                    onSwiper={setSwiperInstance}
                    onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                    breakpoints={{
                        300: { slidesPerView: 1, spaceBetween: 20 },
                        640: { slidesPerView: 1, spaceBetween: 20 },
                        1024: {
                            slidesPerView: props.variant === 'testimonial' ? 3 : 1,
                            spaceBetween: 50,
                        },
                    }}
                >
                    {props.variant === 'testimonial' &&
                        props.testimonials.map((item) => (
                            <SwiperSlide key={item.id} className="p-6 bg-gray rounded-2xl">
                                <div className="flex flex-col gap-5">
                                    <div className="flex justify-between items-center">
                                        <Image src={item.imgSrc} width={80} height={80} alt={item.name} />
                                        <div className="flex gap-1">
                                            {Array.from({ length: item.stars }).map((_, i) => (
                                                <Image key={i} src="/star.svg" width={20} height={20} alt="star" />
                                            ))}
                                        </div>
                                    </div>

                                    <p className="text-xl">{item.review}</p>

                                    <div>
                                        <p className="font-bold">{item.name}</p>
                                        <p className="text-sm">{item.position}</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}

                    {props.variant === 'image' &&
                        props.images.map((img) => (
                            <SwiperSlide key={img.id}>
                                <div className="relative w-fit mx-auto">
                                    <Image
                                        src={img.imgSrc}
                                        width={644}
                                        height={600}
                                        alt="slider image"
                                        className="rounded-2xl object-cover bg-gray"
                                    />

                                    {/* ✅ Arrows live INSIDE image wrapper */}
                                    <button
                                        onClick={handlePrev}
                                        disabled={activeIndex === 0}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-dark-gray/80 hover:bg-dark-gray rounded-full p-2 shadow transition disabled:opacity-30"
                                    >
                                         <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                                    </button>

                                    <button
                                        onClick={handleNext}
                                        disabled={activeIndex === props.images.length - 1}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-dark-gray/80 hover:bg-dark-gray rounded-full p-2 shadow transition disabled:opacity-30"
                                    >
                                        <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                                    </button>
                                </div>
                            </SwiperSlide>
                        ))}

                </Swiper>

                {/* Navigation Buttons for Image Variant */}
                {/* {props.variant === 'image' && (
                    <>
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-dark-gray/80 hover:bg-dark-gray rounded-full p-3 shadow-lg  transition-opacity duration-300 disabled:opacity-30"
                            aria-label="Previous slide"
                            disabled={activeIndex === 0}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-7 top-1/2 -translate-y-1/2 z-10 bg-dark-gray/80 hover:bg-dark-gray rounded-full p-3 shadow-lg  transition-opacity duration-300 disabled:opacity-30"
                            aria-label="Next slide"
                            disabled={props.variant === 'image' && activeIndex === props.images.length - 1}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </>
                )} */}
            </div>

            {/* Thumbnail slider */}
            {props.variant === 'image' && props.showThumbnails && (
                <div className="mt-4 flex gap-3 justify-center">
                    {props.images.map((img, index) => (
                        <button
                            key={img.id}
                            onClick={() => handleThumbnailClick(index)}
                            className={`relative rounded-lg overflow-hidden transition-all duration-300 ${activeIndex === index
                                ? 'opacity-100 ring-2 ring-primary scale-105'
                                : 'opacity-60 hover:opacity-100'
                                }`}
                        >
                            <Image
                                src={img.imgSrc}
                                width={80}
                                height={80}
                                alt="thumb"
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Slider;