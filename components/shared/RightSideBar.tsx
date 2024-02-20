"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import TagHolder from "./TagHolder";

const topQuestion = [
  {
    _id: 1,
    title:
      "Best practices for data fetching in a Next.js application with Server-Side Rendering (SSR)?",
  },
  {
    _id: 2,
    title: "Is it only me or the font is bolder than necessary?",
  },
  {
    _id: 3,
    title: "Can I get the course for free?",
  },
  {
    _id: 4,
    title: "Redux Toolkit Not Updating State as Expected",
  },
];

const popularQuestionTags = [
  { _id: 1, name: "iNurture", totalQuestions: 5 },
  { _id: 2, name: "SPPU", totalQuestions: 5 },
  { _id: 3, name: "Course", totalQuestions: 5 },
  { _id: 4, name: "Faculty", totalQuestions: 5 },
];

const RightSideBar = () => {
  return (
    <section className="background-light900_dark200 custom-scrollbar light-border sticky right-0 top-0 flex h-screen flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden w-[350px]">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {topQuestion.map((quesiton) => (
            <Link
              href={`/quesiton/${quesiton._id}`}
              key={quesiton._id}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">
                {quesiton.title}
              </p>
              <Image
                src="/assets/icons/chevron-right.svg"
                alt="chevron right"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">
          Popular Questions Tags
        </h3>
        <div className="mt-7 flex flex-col gap-4">
          {popularQuestionTags.map((tags) => (
            <TagHolder
              key={tags._id}
              _id={tags._id}
              name={tags.name}
              totalQuestions={tags.totalQuestions}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSideBar;
