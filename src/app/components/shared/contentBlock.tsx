'use client'

import Image from 'next/image'
import React from 'react'
import CustomButton from '../ui/customButton/customButton'
import { useRouter } from 'next/navigation';

interface Paragraph {
  id: number;
  text: string;
}

interface ContentBlockProps {
  imgSrc: string;
  imgWidth?: string;
  heading: string;
  subHeading?: string;
  paragraphs: Paragraph[];
  button?: {
    show: boolean;
    text?: string;
    icon?: string;
    animation?: 'slide';
    path?: string;
  };
  reverse?: boolean;
}

const ContentBlock: React.FC<ContentBlockProps> = ({
  imgSrc,
  imgWidth,
  heading,
  subHeading,
  paragraphs,
  button,
  reverse,
}) => {
  const router = useRouter();
  return (
    <div className="container mx-auto px-4 pt-[140px]">
      <div className={`flex flex-col lg:flex-row ${reverse ? 'lg:flex-row-reverse' : ''} gap-10 lg:gap-27`}>

        {/* Image Block */}
        <div className="lg:w-1/2">
          <Image
            src={imgSrc}
            alt="Block Image"
            height={100}
            width={555}
            className={`object-cover border-4 border-[#8b8b8b] ${imgWidth}`}
          />
        </div>

        {/* Text Block */}
        <div className="lg:w-1/2 flex flex-col justify-center">
          {subHeading && (
            <p className="text-base font-medium text-black mb-5">{subHeading}</p>
          )}

          <p className="text-xl sm:text-5xl font-extralight text-black mb-10">{heading}</p>

          {paragraphs?.map((p) => (
            <p key={p.id} className="text-base font-normal mb-6 w-full lg:max-w-[80%]">
              {p.text}
            </p>
          ))}

          {button?.show && (
            <CustomButton
              text={button.text}
              icon={button.icon ?? "/arrow-forward.svg"}
              onClick={() => router.push(button.path ?? '/')}
            />
          )}
        </div>

      </div>
    </div>

  );
}

export default ContentBlock;
