import { getUsersAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import AnswerCard from "../cards/AnswerCard";

interface Props extends SearchParamsProps {
  clerkId?: string | null;
  userId: string;
}

const AnswersTab = async ({ clerkId, userId, searchParams }: Props) => {
  const result = await getUsersAnswers({
    userId,
    page: 1,
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
    </>
  );
};

export default AnswersTab;
