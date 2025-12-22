import ContentBlock from "@/app/components/shared/contentBlock";
import { teamMembers } from "@/app/constants/team";
import Image from "next/image";
import Link from "next/link";
export default function Home() {
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

      <div className="container mx-auto px-4 pt-[80px] md:pt-[140px]">
        <p className="text-base font-medium mb-5 text-black">TEAM</p>
        <p className="text-2xl md:text-4xl font-bold mb-10 text-black">
          Experts Ready to Serve
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {teamMembers
            ?.sort((a, b) => a.order - b.order)
            .map((member) => (
              <Link
                key={member.id}
                href={`/team/${member.slug}`}
                className="group cursor-pointer transition-all duration-300 ease-in-out hover:bg-dark-gray hover:scale-105 p-4 rounded-lg"
              >
                <Image
                  width={360}
                  height={380}
                  src={member.image.url}
                  alt={member.image.alt}
                  className="h-[380px] object-cover w-full transition-transform duration-300 ease-in-out"
                />

                <div className="flex flex-col">
                  <p className="mt-2 sm:mt-4 font-semibold text-base text-left">
                    {member.name}
                  </p>
                  <p className="sm:mt-4 font-medium text-[14px] text-left">
                    {member.position}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </div>
      <ContentBlock
        imgSrc="/career.svg"
        heading="Professional Individuals"
        subHeading="Dedicated Team"
        paragraphs={[
          {
            id: 1,
            text: "Our power of choice is untrammelled and when nothing prevents being able to do what we like best every pleasure.",
          },
          {
            id: 2,
            text: "Certain circumstances seds owing to the claims duty righteous indignation and so beguiled.",
          },
        ]}
        reverse={false}
        button={{
          show: false,
        }}
      />
    </>
  );
}
