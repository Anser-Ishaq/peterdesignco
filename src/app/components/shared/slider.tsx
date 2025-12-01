'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Image from 'next/image';


interface Testimonial {
    id: number;
    imgSrc: string;
    name: string;
    position: string;
    review: string;
    stars: number;
}

type SliderProps = {
    testimonialsArr: Testimonial[];
};

const Slider = ({ testimonialsArr }: SliderProps) => {
    return (
        <Swiper
            spaceBetween={50}
            slidesPerView={3}
            breakpoints={{
                300: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                },
                640: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                },
                // 768: {
                //   slidesPerView: 4,
                //   spaceBetween: 40,
                // },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 50,
                },
            }}
        >
            {testimonialsArr.map((item) => (
                <SwiperSlide key={item.id} className="p-6 bg-gray">
                    <div className="flex flex-col gap-5 rounded-2xl ">
                        <div className="flex justify-between items-center">
                            <Image src={item.imgSrc} width={80} height={80} alt={item.name} className="" />
                            <div className="flex flex-row gap-1 justify-end">
                                {Array.from({ length: item.stars }).map((_, index) => (
                                    <Image key={index} src="/star.svg" width={20} height={20} alt="star" />
                                ))}
                            </div>
                        </div>
                        <p className="font-normal text-xl">{item.review}</p>
                        <div className="flex flex-row justify-between items-center">
                            <div>
                                <p className="font-extrabold text-base">{item.name}</p>
                                <p className="font-medium text-sm">{item.position}</p>
                            </div>

                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default Slider;