"use client";
import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q");

  const [search, setSearch] = useState(query || "");

  useEffect(() => {
    const delayDebounceFunc = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "q",
          value: search,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["q"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);
    return () => {
      clearTimeout(delayDebounceFunc);
    };
  }, [search, route, pathname, router, searchParams, query]);

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
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
        }}
        className="paragraph-regular text-dark400_light700 no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none"
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
