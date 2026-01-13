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
      const response = await fetch("/api/team?status=active");
      const data = await response.json();

      if (data.success) {
        setTeamMembers(data.data || []);
      } else {
        setError(data.message || "Failed to fetch team members");
      }
    } catch (error) {
      console.error("Failed to fetch team members:", error);
      setError("Failed to load team members");
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
                      alt={
                        member.image.alt ||
                        `${member.name} - ${member.position}`
                      }
                      className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-team.jpg"; // Fallback image
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
                    {(member.socialLinks.linkedin ||
                      member.socialLinks.instagram ||
                      member.socialLinks.facebook) && (
                      <div className="flex space-x-2 mt-3">
                        {member.socialLinks.linkedin && (
                          <a
                            href={member.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-xs"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
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
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
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
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
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
