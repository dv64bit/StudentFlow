"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";

interface CustomInputProps {
  route: string;
  iconPos: string;
  iconSrc: string;
  placeholder: string;
  otherClasses?: string; //optional
}

const LocalSearch = ({
  route,
  iconPos,
  iconSrc,
  placeholder,
  otherClasses,
}: CustomInputProps) => {
  return (
    <div
      className={`px-4 background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] ${otherClasses}`}
    >
      {iconPos === "left" && (
        <Image
          src={iconSrc}
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}

      <Input
        type="text"
        placeholder={placeholder}
        value=""
        onChange={() => {}}
        className="paragraph-regular no-focus placeholder background-light800_darkgradient border-none shadow-none outline-none"
      />

      {iconPos === "right" && (
        <Image
          src={iconSrc}
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearch;
