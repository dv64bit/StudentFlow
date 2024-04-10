import { getUsersQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import QuestionCard from "../cards/QuestionCard";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const QuestionsTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUsersQuestions({
    userId,
    page: 1,
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
    </>
  );
};

export default QuestionsTab;
