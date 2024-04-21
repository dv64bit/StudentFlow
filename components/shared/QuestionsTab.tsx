import { getUsersQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import QuestionCard from "../cards/QuestionCard";
import Pagination from "./Pagination";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const QuestionsTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUsersQuestions({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });
  return (
    <>
      {result.questions.map((eachQuestion) => (
        <QuestionCard
          key={eachQuestion._id}
          _id={eachQuestion._id}
          clerkId={clerkId}
          quesitonTitle={eachQuestion.questionTitle}
          questionTags={eachQuestion.questionTags}
          user={eachQuestion.user}
          upvotes={eachQuestion.upvotes}
          views={eachQuestion.views}
          answers={eachQuestion.answers}
          createdAt={eachQuestion.createdAt}
        />
      ))}
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1} //searchParams se jo bhi aata hai woh string ke format mai aata hai, toh usko number mai convert karne ke liye yeh line use kar rahe hai hum
          // ? +searchParams.page : 1: This is a ternary operator that checks if searchParams?.page exists and converts it to a number (+searchParams.page). If searchParams?.page is null or undefined, it defaults to 1.
          isNext={result.isNext}
        />
      </div>
    </>
  );
};

export default QuestionsTab;
