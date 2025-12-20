import Image from "next/image";
import CustomButton from "./components/ui/customButton/customButton";
import ModelViewer from "./components/sections/modelViewer";
import Accordion from "./components/shared/accordion";
import ContentBlock from "./components/shared/contentBlock";
import Services from "./components/shared/services";
import Testimonials from "./components/shared/testimonials";
import ContactForm from "./components/shared/contactForm";
const Home = () => {

  const latestProjectArr = [
    { id: 1, src: '/p1.svg', rowSpan: '' },
    { id: 2, src: '/p2.svg', rowSpan: 'row-span-2' },
    { id: 3, src: '/p3.svg', rowSpan: '' },
    { id: 4, src: '/p3.svg', rowSpan: 'row-span-2' },
    { id: 5, src: '/p4.svg', rowSpan: 'row-span-2' },
    { id: 6, src: '/p1.svg', rowSpan: '' },
  ];

  return (
    <>
      {/* hero section */}
      <div className="relative w-full h-screen">
        <Image
          src="/home-bg.svg"
          alt="Home Image"
          fill
          className="object-cover"
        />
        <div className="absolute bottom-[-40px] w-full flex justify-center items-center">
          <Image
            src="/main.svg"
            alt="Home Image"
            height={33}
            width={555}
            className="object-cover px-3.5"
          />
        </div>
      </div>

      {/* about section */}
      <ContentBlock
        imgSrc="/decor.svg"
        imgWidth={'w-full'}
        heading="About Peter Design Co."
        subHeading="About Us"
        paragraphs={[
          { id: 1, text: "We are a leading turnkey interior design and fit-out company in Pakistan, specializing in turnkey projects. We provide the best turnkey interior design and fit-out services in Pakistan, with extensive experience working on various types of premise." },
        ]}
        button={{
          show: true,
          text: "Read More",
          icon: "/arrow-forward.svg", animation: 'slide',
        }}
      />
      {/* END about section */}

      {/* model section */}
      <div className="mt-[140px] bg-[url('/model-bg.svg')] bg-cover bg-center w-full bg-accent">
        <div className="container mx-auto px-4 py-20 h-full grid grid-cols-1 md:grid-cols-6">
          <div className="flex flex-row flex-wrap items-center md:items-start md:flex-col gap-11">
            <Image src='/360.svg' width={82} height={82} alt="360 degree" />
            <div>
              <p className="font-bold">Main Door</p>
              <p className="font-medium">Metal Gate</p>
            </div>
            <div>
              <p className="font-bold">windows:</p>
              <p className="font-medium">metal and fiber glass</p>
            </div>
            <div>
              <p className="font-bold">interrior:</p>
              <p className="font-medium">wooden furnished</p>
            </div>
            <div>
              <p className="font-bold">electricity:</p>
              <p className="font-medium">main and generator</p>
            </div>
            <div>
              <p className="font-bold">solar energy:</p>
              <p className="font-medium">800 kwh</p>
            </div>
          </div>
          <div className="flex justify-center items-center md:col-span-3">
            <ModelViewer
              url="/appt.glb"
              width={'100%'}
              height={'100%'}
              defaultZoom={1}
              // minZoomDistance={0.01}
              // maxZoomDistance={1}
              showScreenshotButton={false}
              defaultRotationY={0}
              autoRotate={true}
            />
          </div>
          <div className="md:col-span-2 flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <p className="text-base font-medium">feature model</p>
              <p className="text-xl md:text-4xl font-bold">Make it with passion.</p>
            </div>
            <div className="relative hidden md:flex flex-row-reverse justify-end items-center gap-5">
              <p className="text-base font-medium">3d preview modelist living house</p>
              <Image src='/arrows.svg' width={88} height={206} alt="model arrows" />
            </div>
            <div className="flex flex-wrap gap-2">
              <CustomButton text="BUY NOW" icon="/arrow-forward.svg" />
              <CustomButton text="DESIGN YOUR OWN" icon="/arrow-forward.svg" backgroundColor={'bg-transparent!'} border={'border-1 border-gold'} />
            </div>
          </div>
        </div>

      </div>
      {/* END model section */}

      {/* portfolio section */}
      <div className="container mx-auto px-4 pt-[80px] md:pt-[140px]">
        <div>
          <p className="text-base font-medium mb-5">LATEST PROJECTS</p>
          <p className="text-xl md:text-4xl font-bold mb-10">Made It With Passion.</p>
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

      {/* services section */}
      <Services />
      {/* END services se */}

      {/* testimonials */}
      <Testimonials />
      {/* END testimonials */}

      {/* contact */}
      <div className="mt-[140px]">
        <ContactForm />
      </div>
      {/* contact */}
      {/* accordion section */}
      <div className="bg-[url('/model-bg.svg')] bg-cover bg-center w-full">
        <div className="container mx-auto px-4 py-[140px]">
          <div className="flex flex-col justify-center items-center">
            <p className="text-base font-medium mb-5 text-black">FAQs</p>
            <p className="text-2xl md:text-4xl font-bold mb-10 text-black">Frequently Asked Questions</p>
            <Accordion />
          </div>
        </div>
      </div>
      {/* accordion section */}

      {/* sale section */}
      <div className="relative w-full h-screen hidden md:block">
        <Image
          src="/sale.svg"
          alt="sale Image"
          fill
          className="object-cover"
        />
      </div>
    </>
  );
}

export default Home;