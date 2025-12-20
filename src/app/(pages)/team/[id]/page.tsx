import ContentBlock from "@/app/components/shared/contentBlock";
import Image from "next/image";
export default function Home() {
  const latestProjectArr = [
    { id: 1, src: "/p1.svg", rowSpan: "" },
    { id: 2, src: "/p2.svg", rowSpan: "row-span-2" },
    { id: 3, src: "/p3.svg", rowSpan: "" },
    { id: 4, src: "/p3.svg", rowSpan: "row-span-2" },
    { id: 5, src: "/p4.svg", rowSpan: "row-span-2" },
    { id: 6, src: "/p1.svg", rowSpan: "" },
  ];
  return (
    <>
      <ContentBlock
        imgSrc="/career.svg"
        heading="Name"
        subHeading="Position"
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
                className={`${item.rowSpan} relative overflow-hidden`}
              >
                <Image
                  src={item.src}
                  alt={item.src}
                  fill
                  className="object-cover"
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
