import FilterComp from "@/components/shared/FilterComp";
import QuestionCard from "@/components/cards/QuestionCard";
import ResultNotFound from "@/components/shared/ResultNotFound";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { QuestionFilters } from "@/constants/filter";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { SearchParamsProps } from "@/types";

export default async function Home({ searchParams }: SearchParamsProps) {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const result = await getSavedQuestions({
    clerkId: userId,
    searchQuery: searchParams.q,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={`/collection`}
          iconPos="left"
          iconSrc="/assets/icons/search.svg"
          placeholder="Search your query..."
          otherClasses="flex-1"
        />
        <FilterComp
          filterOptions={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {/* Looping through quesiton using map */}
        {result.questions.length > 0 ? (
          result.questions.map((questions: any) => (
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
            title="There is no saved quesitons to show"
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
}
