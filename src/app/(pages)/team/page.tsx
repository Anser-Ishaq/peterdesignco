"use client";

import { useState, useEffect } from "react";
import ContentBlock from "@/app/components/shared/contentBlock";
import Image from "next/image";
import Link from "next/link";
import { TeamMember } from "@/app/types/team";
import { getRoleDisplayName } from "@/app/utils/teamUtils";

export default function Home() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/team?status=active');
      const data = await response.json();

      if (data.success) {
        setTeamMembers(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch team members');
      }
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      setError('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

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
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-gray-600">Loading team members...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchTeamMembers}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
            {teamMembers
              .sort((a, b) => a.order - b.order)
              .map((member) => (
                <Link
                  key={member._id}
                  href={`/team/${member.slug}`}
                  className="group cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-50 hover:scale-105 p-4 rounded-lg"
                >
                  <div className="relative w-full h-[380px] overflow-hidden rounded-lg">
                    <Image
                      fill
                      src={member.image.url}
                      alt={member.image.alt || `${member.name} - ${member.position}`}
                      className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-team.jpg'; // Fallback image
                      }}
                    />
                  </div>

                  <div className="flex flex-col mt-4">
                    <h3 className="font-semibold text-lg text-left text-gray-900 group-hover:text-blue-600 transition-colors">
                      {member.name}
                    </h3>
                    <p className="mt-1 font-medium text-sm text-left text-gray-600">
                      {member.position}
                    </p>
                    <p className="mt-1 text-xs text-left text-gray-500 capitalize">
                      {getRoleDisplayName(member.role)}
                    </p>
                    
                    {/* Social Links */}
                    {(member.socialLinks.linkedin || member.socialLinks.instagram || member.socialLinks.facebook) && (
                      <div className="flex space-x-2 mt-3">
                        {member.socialLinks.linkedin && (
                          <a
                            href={member.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-xs"
                            onClick={(e) => e.stopPropagation()}
                          >
                            LinkedIn
                          </a>
                        )}
                        {member.socialLinks.instagram && (
                          <a
                            href={member.socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-600 hover:text-pink-800 text-xs"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Instagram
                          </a>
                        )}
                        {member.socialLinks.facebook && (
                          <a
                            href={member.socialLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 hover:text-blue-900 text-xs"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Facebook
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
          </div>
        )}
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
