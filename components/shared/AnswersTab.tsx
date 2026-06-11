import { getUsersAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import AnswerCard from "../cards/AnswerCard";
import Pagination from "./Pagination";

interface Props extends SearchParamsProps {
  clerkId?: string | null;
  userId: string;
}

const AnswersTab = async ({ clerkId, userId, searchParams }: Props) => {
  const result = await getUsersAnswers({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });
  return (
    <>
      {result.answers.map((eachAnswers) => (
        <AnswerCard
          key={eachAnswers._id}
          clerkId={clerkId}
          _id={eachAnswers._id}
          question={eachAnswers.question}
          user={eachAnswers.user}
          upvotes={eachAnswers.upvotes.length}
          createdAt={eachAnswers.createdAt}
        />
      ))}
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1} //searchParams se jo bhi aata hai woh string ke format mai aata hai, toh usko number mai convert karne ke liye yeh line use kar rahe hai hum
          // ? +searchParams.page : 1: This is a ternary operator that checks if searchParams?.page exists and converts it to a number (+searchParams.page). If searchParams?.page is null or undefined, it defaults to 1.
          isNext={result.isNextAnswer}
        />
      </div>
    </>
  );
};

export default AnswersTab;
