"use client";
import ContentBlock from "@/app/components/shared/contentBlock";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TeamMember } from "@/app/types/team";
import { getRoleDisplayName } from "@/app/utils/teamUtils";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default function TeamDetailPage({ params }: Props) {
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState<string>("");

  const latestProjectArr = [
    { id: 1, src: "/p1.svg", rowSpan: "" },
    { id: 2, src: "/p2.svg", rowSpan: "row-span-2" },
    { id: 3, src: "/p3.svg", rowSpan: "" },
    { id: 4, src: "/p3.svg", rowSpan: "row-span-2" },
    { id: 5, src: "/p4.svg", rowSpan: "row-span-2" },
    { id: 6, src: "/p1.svg", rowSpan: "" },
  ];

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (slug) {
      getTeamMember();
    }
  }, [slug]);

  const getTeamMember = async () => {
    try {
      setLoading(true);
      setError(null);

      // First, get all team members and find by slug
      const response = await fetch("/api/team?status=active");
      const data = await response.json();

      if (data.success) {
        const member = data.data.find((item: TeamMember) => item.slug === slug);
        if (member) {
          setTeamMember(member);
        } else {
          setError("Team member not found");
        }
      } else {
        setError(data.message || "Failed to fetch team member");
      }
    } catch (error) {
      console.error("Error fetching team member:", error);
      setError("Failed to load team member");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading team member...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Team Member Not Found
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={getTeamMember}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mr-4"
          >
            Try Again
          </button>
          <a
            href="/team"
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Back to Team
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <ContentBlock
        imgSrc={teamMember?.image?.url || "/career.svg"}
        heading={teamMember?.name || "Team Member"}
        subHeading={`${
          teamMember?.position || "Position"
        } • ${getRoleDisplayName(teamMember?.role || "administration")}`}
        paragraphs={
          teamMember?.bio && teamMember.bio.length > 0
            ? teamMember.bio.map((bioText, index) => ({
                id: index + 1,
                text: bioText,
              }))
            : [
                {
                  id: 1,
                  text: "Our power of choice is untrammelled and when nothing prevents being able to do what we like best every pleasure.",
                },
                {
                  id: 2,
                  text: "Certain circumstances seds owing to the claims duty righteous indignation and so beguiled.",
                },
              ]
        }
        reverse={false}
        button={{
          show: false,
        }}
      />
      {/* portfolio section */}
      <div className="container mx-auto px-4 pt-[80px] md:pt-[140px]">
        <div>
          <p className="text-base font-medium mb-5">LATEST PROJECTS</p>
          <p className="text-xl md:text-4xl font-bold mb-10">
            Made It With Passion.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px]">
            {latestProjectArr.map((item, index) => (
              <div
                key={index}
                className={`${item.rowSpan} relative overflow-hidden rounded-lg`}
              >
                <Image
                  src={item.src}
                  alt={`Project ${index + 1}`}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* END portfolio section */}
    </>
  );
}
