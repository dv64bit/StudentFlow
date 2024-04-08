import QuestionCard from "@/components/cards/QuestionCard";
import ResultNotFound from "@/components/shared/ResultNotFound";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { IQuestion } from "@/database/question.model";
import { getQuestionsByTagId } from "@/lib/actions/tag.actions";
import { URLProps } from "@/types";
import React from "react";

const Page = async ({ params, searchParams }: URLProps) => {
  const result = await getQuestionsByTagId({
    tagId: params.id,
    page: 1,
    searchQuery: searchParams.q,
  });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{result.tagTitle}</h1>
      <div className="mt-11 w-full">
        <LocalSearch
          route="/"
          iconPos="left"
          iconSrc="/assets/icons/search.svg"
          placeholder="Search your query..."
          otherClasses="flex-1"
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {/* Looping through quesiton using map */}
        {result.questions.length > 0 ? (
          result.questions.map((questions: IQuestion) => (
            <QuestionCard
              key={questions._id}
              _id={questions._id}
              quesitonTitle={questions.questionTitle}
              questionTags={questions.questionTags}
              user={questions.user}
              upvotes={questions.upvotes}
              views={questions.views}
              answers={questions.answers}
              createdAt={questions.createdAt}
            />
          ))
        ) : (
          <ResultNotFound
            title="There is no tag quesitons to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
        discussion. Our query could be the next big thing others learn from. Get
        involved!"
            buttonLink="/ask-question"
            buttonTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
};

export default Page;
