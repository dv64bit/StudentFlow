"use client";
import { HomePageFilters } from "@/constants/filter";
import React from "react";
import { Button } from "../ui/button";
import { Item } from "@radix-ui/react-menubar";

const HomeFilters = () => {
  const active = "newest";
  return (
    <div className="mt-10 flex-wrap gap-3 md:flex hidden">
      {HomePageFilters.map((options) => (
        <Button
          key={options.value}
          onClick={() => {}}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${active === options.value ? "bg-primary-100 text-primary-500" : "bg-light-800 text-light-500"}`}
        >
          {options.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
