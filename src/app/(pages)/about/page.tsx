'use client';

import { useState, useEffect } from 'react';
import ContentBlock from "@/app/components/shared/contentBlock";
import Services from "@/app/components/shared/services";
import Testimonials from "@/app/components/shared/testimonials";
import Image from "next/image";

interface TeamMember {
  _id: string;
  name: string;
  slug: string;
  role: string;
  position: string;
  image: {
    url: string;
    publicId: string;
    alt?: string;
  };
  bio: string[];
  socialLinks: {
    linkedin?: string | null;
    instagram?: string | null;
    facebook?: string | null;
  };
  order: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export default function AboutPage() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTeamMembers();
    }, []);

    const fetchTeamMembers = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/team?status=active&limit=20');
            const data = await response.json();

            if (data.success) {
                setTeamMembers(data.data);
            } else {
                setError('Failed to load team members');
                console.error('Failed to fetch team members:', data.message);
            }
        } catch (error) {
            console.error('Error fetching team members:', error);
            setError('Failed to load team members');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* hero section */}
            <div className="relative w-full h-screen">
                <Image
                    src="/about-bg.svg"
                    alt="About Image"
                    fill
                    className="object-cover brightness-25"
                />
                <div className="absolute top-2/5 z-20 w-full flex flex-col gap-6 justify-center items-center text-white">
                    <p className="font-medium text-base">We Sketch. We Debate. We Build.</p>
                    <p className="font-extralight text-2xl lg:text-5xl text-center max-w-[800px]">Where Chaos Becomes Iconic.</p>
                </div>
            </div>

            {/* ceo message*/}
            <div>
                <ContentBlock
                    imgSrc="/ceo1.png"
                    heading="Welcome to PDC"
                    subHeading="CEO Message"
                    paragraphs={[
                        { id: 1, text: "As the CEO and lead designer, I'm thrilled to share our passion for creating beautiful, functional, and inspiring spaces with you. With 10 years of experience in interior design, we've had the privilege of working with clients." },
                        { id: 2, text: 'At PETER DESIGN CO., we believe that interior design is not just about aesthetics; its about creating environments that enhance lives and foster connections. Our team is dedicated to delivering exceptional design solutions that exceed our clients expectations, on time and within budget.' },
                        { id: 3, text: 'We are committed to staying at the forefront of design trends, technologies, and sustainability practices, ensuring that our clients receive innovative and forward-thinking solutions.' }
                    ]}
                    reverse={true}
                    button={{
                        show: false,
                    }}
                />
            </div>
            {/* about section */}
            <div>
                <ContentBlock
                    imgSrc="/decor.svg"
                    imgWidth="w-full"
                    heading="Design With a Soul"
                    subHeading="OUR PHILOSOPHY"
                    paragraphs={[
                        { id: 1, text: "Our team takes over everything, from an idea and concept development to realization. We believe in traditions and incorporate them within our innovations. All our projects incorporate a unique artistic image and functional solutions." },
                        { id: 2, text: 'Client is the soul of the project. Our main goal is to illustrate his/hers values and individuality.' },
                    ]}
                    reverse={false}
                    button={{
                        show: false,
                    }}
                />
            </div>

            {/* Teams section */}
            <div>
                <div className="container mx-auto px-4 pt-[80px] md:pt-[140px]">
                    <p className="text-base font-medium mb-5 text-black">TEAM</p>
                    <p className="text-2xl md:text-4xl font-bold mb-10 text-black">Experts Ready to Serve</p>
                    
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading team members...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-600 mb-4">{error}</p>
                            <button
                                onClick={fetchTeamMembers}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : teamMembers.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600">No team members found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                            {teamMembers.map((member) => (
                                <div key={member._id} className="">
                                    <div className="relative w-full h-[380px]">
                                        <Image 
                                            fill
                                            src={member.image.url} 
                                            alt={member.image.alt || member.name} 
                                            className="h-[380px] object-cover w-full rounded-lg"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    </div>
                                    <div className="mt-2 sm:mt-4 text-center">
                                        <p className="font-bold text-2xl lg:text-3xl">{member.name}</p>
                                        <p className="text-gray-600 text-lg mt-1">{member.position}</p>
                                        {member.socialLinks && (
                                            <div className="flex justify-center gap-3 mt-3">
                                                {member.socialLinks.linkedin && (
                                                    <a
                                                        href={member.socialLinks.linkedin}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                                        </svg>
                                                    </a>
                                                )}
                                                {member.socialLinks.instagram && (
                                                    <a
                                                        href={member.socialLinks.instagram}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-pink-600 hover:text-pink-800"
                                                    >
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                                        </svg>
                                                    </a>
                                                )}
                                                {member.socialLinks.facebook && (
                                                    <a
                                                        href={member.socialLinks.facebook}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-800 hover:text-blue-900"
                                                    >
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                                        </svg>
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/*END Teams section */}

            {/* Services */}
            <Services />
            {/* END Services */}
            <Testimonials />
        </>
    );
}
