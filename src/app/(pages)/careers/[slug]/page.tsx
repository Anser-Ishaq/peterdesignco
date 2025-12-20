import CustomButton from "@/app/components/ui/customButton/customButton";
import CustomInput from "@/app/components/ui/customInput/customInput";
import CustomTextarea from "@/app/components/ui/customTextarea/customTextarea";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="container mx-auto pt-[80px] md:pt-[140px] px-4">
        <div className="flex flex-col gap-6 justify-center items-center mb-10 text-black px-4">
          <p className="font-medium text-base">Join Our Team</p>
          <p className="font-bold text-2xl lg:text-5xl text-center max-w-[800px]">
            We Are Hiring Now!
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <CustomInput placeholder="Name" type="text" />
            <CustomInput placeholder="Email" type="email" />
            <CustomInput placeholder="Degree" type="text" />
            <CustomInput placeholder="Years of Exp" type="number" />
            <CustomInput placeholder="Expected Salary" type="number" />
          </div>
          <CustomInput placeholder="Upload your Resume" type="file" />

          <CustomTextarea placeholder="Your Motivation to Join our Company" />
          <CustomButton text="Submit" />
        </div>
      </div>
    </>
  );
}
