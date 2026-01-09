'use client';

import { useState, useEffect } from 'react';
import ContentBlock from "@/app/components/shared/contentBlock";
import CustomButton from "@/app/components/ui/customButton/customButton";
import Image from "next/image";
import Link from "next/link";

interface Career {
  _id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  workMode: string;
  employmentType: string;
  experienceLevel: string;
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  responsibilities: string[];
  status: string;
  postedAt: string;
  applyBy: string;
}

const page = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await fetch("/api/careers?status=active");
        const data = await response.json();

        if (data.success) {
          setCareers(data.data);
        }
      } catch (error) {
        console.error("Error fetching careers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCareers();
  }, []);

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
          <p className="font-bold text-2xl lg:text-5xl text-center max-w-[800px]">
            WE Are Hiring Now!
          </p>
        </div>
      </div>
      <ContentBlock
        imgSrc="/career.svg"
        imgWidth={"w-full"}
        heading="Professional Individuals"
        subHeading="Dedicated Team"
        paragraphs={[
          {
            id: 1,
            text: "We are a leading turnkey interior design and fit-out company in Pakistan, specializing in turnkey projects. We provide the best turnkey interior design and fit-out services in Pakistan, with extensive experience working on various types of premise.",
          },
          {
            id: 2,
            text: "We are a leading turnkey interior design and fit-out company in Pakistan, specializing in turnkey projects. ",
          },
          {
            id: 3,
            text: "We are a leading turnkey interior design and fit-out company in Pakistan, specializing in turnkey projects. We provide the best turnkey interior design and fit-out services in Pakistan, with extensive experience working on various types of premise.",
          },
        ]}
        button={{
          show: true,
          text: "Read More",
          icon: "/arrow-forward.svg",
          animation: "slide",
          path: "/about",
        }}
      />

      {/* Careers Listing */}
      <div>
        <div className="container mx-auto px-4 pt-[80px] md:pt-[140px]">
          <p className="text-center">Open Vacancies</p>
          <div className="">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading careers...</p>
              </div>
            ) : careers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No open positions available at the moment.</p>
              </div>
            ) : (
              careers.map((career) => (
                <div
                  key={career._id}
                  className="border-b border-gray grid grid-cols-1 md:grid-cols-5 py-12"
                >
                  <div className="flex flex-col">
                    <p className="text-base font-medium mb-1">
                      {career.location} | {career.employmentType}
                    </p>
                    <h3 className="text-2xl font-black mb-2">{career.title}</h3>
                  </div>
                  <p className="text-base font-normal mb-4 max-w-full md:max-w-[800px] md:px-5 md:col-span-3">
                    {career.description}
                  </p>
                  <Link href={`/careers/${career.slug}`}>
                    <CustomButton
                      text="Apply Now"
                      border="rounded-full"
                      width="w-full md:w-auto"
                    />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default page;