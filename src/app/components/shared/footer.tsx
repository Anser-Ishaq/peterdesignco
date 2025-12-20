import React from "react";
import CustomInput from "../ui/customInput/customInput";
import CustomButton from "../ui/customButton/customButton";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="pt-6">
      <div className="bg-[url('/footer-bg.svg')] bg-cover bg-center w-full z-0">
        <div className="container mx-auto px-4 pt-[80px] md:pt-[140px] pb-[50px]">
          <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 text-white pb-[50px] gap-8">
            {/* Column 1 */}
            <div className="flex flex-col gap-4 text-base font-extralight">
              <p className="font-bold text-base">UserFull Links</p>
              <Link href="/about" className="font-normal">
                About
              </Link>
              <Link href="/modeling" className="font-normal">
                Modeling
              </Link>
              <Link href="/careers" className="font-normal">
                Careers
              </Link>
              <Link href="/team" className="font-normal">
                Team
              </Link>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-4 text-base font-extralight">
              <p className="font-bold text-base">Account Details</p>
              <Link href="/dashboard" className="font-normal">
                Dashboard
              </Link>
              <Link href="/cart className='font-normal'">Cart</Link>
              <Link href="/login" className="font-normal">
                Login
              </Link>
              <Link href="/register" className="font-normal">
                Register
              </Link>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-4 text-base font-extralight">
              <p className="font-bold text-base">Resources</p>
              <Link href="https://x.com" className="font-normal">
                LinkedIn
              </Link>
              <Link href="https://x.com" className="font-normal">
                Facebook
              </Link>
              <Link href="https://x.com" className="font-normal">
                Instagram
              </Link>
            </div>

            {/* Subscribe — full width on small screens */}
            <div className="col-span-2 md:col-span-1 flex flex-col gap-4 text-base font-extralight">
              <p className="font-bold text-base">Subscribe</p>

              <div className="flex gap-1.5">
                <CustomInput
                  backgroundColor="bg-white"
                  height="h-[50px]"
                  width="w-full"
                  border="border border-dark-gray rounded-[6px]"
                  placeholder="Email Address"
                />
                <CustomButton
                  icon="/arrow-forward.svg"
                  height="h-[50px]"
                  width="w-[85px]"
                  border="border border--dark-gold rounded-[6px]"
                  backgroundColor="bg-dark-gold"
                  padding="p-3"
                />
              </div>

              <p>
                We are a leading turnkey interior design and fit-out company in
                Pakistan, specializing in turnkey projects. We provide the best
                turnkey interior design and fit-out services in Pakistan, with
                extensive experience working on various types of premise.
              </p>
            </div>
          </div>

          <div className="h-[1px] w-full bg-dark-gray"></div>
          <div className="text-white flex flex-col gap-5 md:gap-0 md:flex-row justify-center md:justify-between items-start md:items-center pt-[30px]">
            <Link href="/">
              <div className="relative flex flex-col gap-4">
                <Image
                  src="/footer-logo.svg"
                  alt="Home Image"
                  height={80}
                  width={218}
                  className="object-cover"
                />
                <Image
                  src="/main.svg"
                  alt="Home Image"
                  height={100}
                  width={150}
                  className="object-cover invert"
                />
              </div>
            </Link>
            {/* <div className='flex gap-[40px]'>
                            <div>Terms</div>
                            <div>Privacy</div>
                            <div>Cookies</div>
                        </div> */}
            <div className="relative flex gap-3.5">
              <Link href="https://linkedin.com">
                <Image
                  src="/Linkedin.svg"
                  alt="social"
                  height={35}
                  width={35}
                  className="object-cover"
                />
              </Link>
              <Link href="https://x.com">
                <Image
                  src="/Twitter.svg"
                  alt="social"
                  height={35}
                  width={35}
                  className="object-cover"
                />
              </Link>
              <Link href="https://facebook.com">
                <Image
                  src="/Facebook.svg"
                  alt="social"
                  height={35}
                  width={35}
                  className="object-cover"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
