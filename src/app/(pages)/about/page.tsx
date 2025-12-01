import ContentBlock from "@/app/components/shared/contentBlock";
import Services from "@/app/components/shared/services";
import Testimonials from "@/app/components/shared/testimonials";
import Image from "next/image";

const teamMembers = [
    {
        id: 1,
        name: "Hushaam Hayat Peter",
        imgSrc: "/team1.JPG",
    },
    {
        id: 2,
        name: "Hushaam Hayat Peter",
        imgSrc: "/team1.JPG",
    },
    {
        id: 3,
        name: "Hushaam Hayat Peter",
        imgSrc: "/team1.JPG",
    },
    {
        id: 4,
        name: "Hushaam Hayat Peter",
        imgSrc: "/team1.JPG",
    },
    {
        id: 5,
        name: "Hushaam Hayat Peter",
        imgSrc: "/team1.JPG",
    },
    {
        id: 6,
        name: "Hushaam Hayat Peter",
        imgSrc: "/team1.JPG",
    },
]


export default function Home() {
    return (
        <>
            {/* hero section */}
            <div className="relative w-full h-screen">
                <Image
                    src="/about-bg.svg"
                    alt="ABout Image"
                    fill
                    className="object-cover opacity-90"
                />
                <div className="absolute top-2/5 z-20 w-full flex flex-col gap-6 justify-center items-center text-white">
                    <p className="font-medium text-base">ABOUT OUR ARCHITECTS</p>
                    <p className="font-bold text-2xl lg:text-5xl text-center max-w-[800px]">We are based on collective workand shared knowledge</p>
                </div>
            </div>

            {/* ceo message*/}
            <div>
                <ContentBlock
                    imgSrc="/ceo1.png"
                    heading="Welcome to CAD-CONS"
                    subHeading="CEO Message"
                    paragraphs={[
                        { id: 1, text: "As the CEO and lead designer, I'm thrilled to share our passion for creating beautiful, functional, and inspiring spaces with you. With 10 years of experience in interior design, we've had the privilege of working with clients." },
                        { id: 2, text: 'At CAD-CONS, we believe that interior design is not just about aesthetics; its about creating environments that enhance lives and foster connections. Our team is dedicated to delivering exceptional design solutions that exceed our clients expectations, on time and within budget.' },
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
                    heading="Make with love all what we do."
                    subHeading="NUMBERS"
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                        {teamMembers?.map((member) => (
                            <div key={member.id} className="">
                                <Image width={360} height={380} src={member.imgSrc} alt={member.name} className="h-[380px] object-cover w-full" />
                                <p className="mt-2 sm:mt-4 font-bold text-2xl lg:text-3xl text-center">{member.name}</p>
                            </div>
                        ))}
                    </div>
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
