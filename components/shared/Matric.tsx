import Image from "next/image";
import Link from "next/link";
import React from "react";

interface MetricProps {
  imgUrl: string;
  alt: string;
  value: string | number;
  title: string;
  href?: string;
  textStyle?: string;
  isUser?: boolean; //this will check if the person seeing this question is the same as loggedIn user or not, based on that we will show the edit quesition opition
}

const Matric = ({
  imgUrl,
  alt,
  value,
  title,
  textStyle,
  href,
  isUser,
}: MetricProps) => {
  // Since for the user matric the section was not clickable that's why I have to wrap it into a fuction and pass it through the <Link>
  const contantMatric = (
    <>
      <Image
        src={imgUrl}
        width={16}
        height={16}
        alt={alt}
        className={`object-contain ${href && "rounded-full"}`} //agar image user wali hai toh uske pass image ka url hoga toh uss situation mein mai user ki image rounded render karunga, agar url nahi raha toh matlab woh sirf other metadata hai jisko mai normally render karunga
      />
      <p className={`${textStyle} flex items-center gap-1`}>
        {value}
        <span
          className={`small-regular line-clamp-1 ${isUser && "max-sm:hidden"}`}
        >
          {title}
        </span>
      </p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="flex-center gap-1">
        {contantMatric}
      </Link>
    );
  }
  return <div className="flex-center flex-wrap gap-1">{contantMatric}</div>;
};

export default Matric;
