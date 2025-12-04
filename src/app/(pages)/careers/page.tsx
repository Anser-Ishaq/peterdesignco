import ContentBlock from '@/app/components/shared/contentBlock'
import CustomButton from '@/app/components/ui/customButton/customButton'
import Image from 'next/image'
import React from 'react'
ContentBlock
const page = () => {

    const careersList = [
        {
            id: 1,
            title: 'Interior Designer',
            location: 'Lahore, Pakistan',
            type: 'Full-time',
            description: 'We are looking for a skilled Interior Designer to join our team. The ideal candidate will have experience in creating innovative and functional interior designs for various types of premises.',
            requirements: [
                'Bachelor’s degree in Interior Design or related field.',
                'Proven experience as an Interior Designer.',
                'Strong portfolio showcasing design projects.',
                'Excellent knowledge of design software (e.g., AutoCAD, SketchUp, Adobe Creative Suite).',
            ],
            responsibilities: [
                'Collaborate with clients to understand their design needs and preferences.',
                'Develop design concepts and present them to clients for approval.',
                'Create detailed drawings, specifications, and cost estimates.',
                'Coordinate with contractors and suppliers to ensure project completion on time and within budget.',
            ],
        },
        {
            id: 2,
            title: 'Interior Designer',
            location: 'Lahore, Pakistan',
            type: 'Full-time',
            description: 'We are looking for a skilled Interior Designer to join our team. The ideal candidate will have experience in creating innovative and functional interior designs for various types of premises.',
            requirements: [
                'Bachelor’s degree in Interior Design or related field.',
                'Proven experience as an Interior Designer.',
                'Strong portfolio showcasing design projects.',
                'Excellent knowledge of design software (e.g., AutoCAD, SketchUp, Adobe Creative Suite).',
            ],
            responsibilities: [
                'Collaborate with clients to understand their design needs and preferences.',
                'Develop design concepts and present them to clients for approval.',
                'Create detailed drawings, specifications, and cost estimates.',
                'Coordinate with contractors and suppliers to ensure project completion on time and within budget.',
            ],
        },
    ]
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
                    <p className="font-medium text-base">Join Our Team</p>
                    <p className="font-bold text-2xl lg:text-5xl text-center max-w-[800px]">WE Are Hiring Now!</p>
                </div>
            </div>
            <ContentBlock
                imgSrc="/career.svg"
                imgWidth={'w-full'}
                heading="Professional Individuals"
                subHeading="Dedicated Team"
                paragraphs={[
                    { id: 1, text: "We are a leading turnkey interior design and fit-out company in Pakistan, specializing in turnkey projects. We provide the best turnkey interior design and fit-out services in Pakistan, with extensive experience working on various types of premise." },
                    { id: 2, text: "We are a leading turnkey interior design and fit-out company in Pakistan, specializing in turnkey projects. " },
                    { id: 3, text: "We are a leading turnkey interior design and fit-out company in Pakistan, specializing in turnkey projects. We provide the best turnkey interior design and fit-out services in Pakistan, with extensive experience working on various types of premise." },
                ]}
                button={{
                    show: true,
                    text: "Read More",
                    icon: "/arrow-forward.svg", animation: 'slide', path: '/about'
                }}
            />

            {/* Careers Listing */}

            <div>
                <div className='container mx-auto px-4 pt-[80px] md:pt-[140px]'>
                    <p className='text-center'>Open Vacancies</p>
                    <div className=''>
                        {careersList.map((career) => (
                            <div key={career.id} className="border-b border-gray flex flex-col md:flex-row justify-between py-12">
                                <div className='flex flex-col'>
                                <p className="text-base font-medium mb-1">{career.location} | {career.type}</p>
                                <h3 className="text-2xl font-black mb-2">{career.title}</h3>
                                </div>
                                <p className="text-base font-normal mb-4 max-w-full md:max-w-[800px] md:px-5">{career.description}</p>
                                <CustomButton text='Apply Now' border='rounded-full'/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default page
