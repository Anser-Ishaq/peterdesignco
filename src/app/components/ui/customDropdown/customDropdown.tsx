"use client";
import Image from "next/image";
import React, { useState } from "react";

type DropdownProps = {
  options?: string[];
  defaultOption?: string;
  onSelect?: (option: string) => void;
};

const CustomDropdown = ({
  options = [
    "Default Sorting",
    "Price: Low to High",
    "Price: High to Low",
    "Newest First",
  ],
  defaultOption = "Default Sorting",
  onSelect,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultOption);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <div className="relative w-[200px]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-[50px] flex items-center justify-between px-5 py-3.5 border border--dark-gray bg-transparent cursor-pointer"
      >
        <span className="text-sm">{selectedOption}</span>
        <Image
          src="/dropdown.svg"
          alt="dropdown"
          width={12}
          height={12}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 border border-gray bg-white z-50 shadow-lg">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleSelect(option)}
              className="px-5 py-3 cursor-pointer hover:bg-gray/20 transition-colors text-sm"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
