import React from "react";
import FilterComp from "./FilterComp";
import { AnswerFilters } from "@/constants/filter";
import { getAnswers } from "@/lib/actions/answer.action";
import Link from "next/link";
import Image from "next/image";
import { getCreatedTimeStamp } from "@/lib/utils";
import ParseHTML from "./ParseHTML";
import Votes from "./Votes";
import Pagination from "./Pagination";

interface Props {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: number;
  filter?: string;
}

const AllAnswers = async ({
  questionId,
  userId,
  totalAnswers,
  page,
  filter,
}: Props) => {
  const result = await getAnswers({
    questionId,
    page: page ? +page : 1,
    sortBy: filter,
  });

  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>
        <FilterComp filterOptions={AnswerFilters} />
      </div>
      <div>
        {result.answers.map((answer) => (
          <article key={answer._id} className="light-border border-b py-10">
            <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
              <Link
                href={`/profile/${answer.user.clerkId}`}
                className="flex flex-1 items-start gap-1 sm:items-center"
              >
                <Image
                  src={answer.user.profilePicture}
                  width={18}
                  height={18}
                  alt="profile"
                  className="rounded-full object-cover max-sm:mt-0.5"
                />
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <p className="body-semibold text-dark300_light700">
                    {answer.user.fullName}
                  </p>

                  <p className="small-regular text-light400_light500 ml-1 mt-0.5 line-clamp-1">
                    - answered {getCreatedTimeStamp(answer.createdAt)}
                  </p>
                </div>
              </Link>
              <div className="flex justify-end">
                <Votes
                  type="Answer"
                  itemId={JSON.stringify(answer._id)}
                  userId={JSON.stringify(userId)}
                  upvotes={answer.upvotes.length}
                  hasupVoted={answer.upvotes.includes(userId)}
                  downvotes={answer.downvotes.length}
                  hasdownVoted={answer.downvotes.includes(userId)}
                />
              </div>
            </div>
            <ParseHTML data={answer.content} />
            {/* SPAN ID */}
          </article>
        ))}
      </div>
      <div className="mt-10 w-full">
        <Pagination
          pageNumber={page ? +page : 1} //searchParams se jo bhi aata hai woh string ke format mai aata hai, toh usko number mai convert karne ke liye yeh line use kar rahe hai hum
          // ? +searchParams.page : 1: This is a ternary operator that checks if searchParams?.page exists and converts it to a number (+searchParams.page). If searchParams?.page is null or undefined, it defaults to 1.
          isNext={result.isNext}
        />
      </div>
    </div>
  );
};

export default AllAnswers;
