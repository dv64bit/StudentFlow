import HomeFilters from "@/components/home/HomeFilters";
import FilterComp from "@/components/shared/FilterComp";
import QuestionCard from "@/components/cards/QuestionCard";
import ResultNotFound from "@/components/shared/ResultNotFound";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filter";
import Link from "next/link";
import {
  getQuestions,
  getRecommendedQuestions,
} from "@/lib/actions/question.action";
import { SearchParamsProps } from "@/types";
import Pagination from "@/components/shared/Pagination";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs";
import QuestionsTab from "@/components/shared/QuestionsTab";

export const metadata: Metadata = {
  title: "Home | StudentFlow",
  description: "StudentFlow is exclusive community driven ADYPU platform.",
};

export default async function Home({ searchParams }: SearchParamsProps) {
  const { userId } = auth();

  let result;
  if (searchParams?.filter === "recommended") {
    if (userId) {
      result = await getRecommendedQuestions({
        userId,
        searchQuery: searchParams.q,
        page: searchParams.page ? +searchParams.page : 1,
      });
    } else {
      result = {
        questions: [],
        isNext: false,
      };
    }
  } else {
    // yaha pe mai quesitons ko filter karne ke liye serchParams ka use kar raha hu, and jesa mai filter apply karunga wesa mujhe question home page pe dikhenge
    result = await getQuestions({
      searchQuery: searchParams.q,
      filter: searchParams.filter,
      page: searchParams.page ? +searchParams.page : 1,
    });
  }

  return (
    <>
      <div className="flex flex-col-reverse w-full justify-between gap-3 sm:flex-row">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={`/`}
          iconPos="left"
          iconSrc="/assets/icons/search.svg"
          placeholder="Search your query..."
          otherClasses="flex-1 dark:text-white"
        />
        <FilterComp
          filterOptions={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <HomeFilters />
      <div className="mt-10 flex w-full flex-col gap-6">
        {/* Looping through quesiton using map */}
        {result.questions.length > 0 ? (
          result.questions.map((questions) => (
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
            title="There is no quesitons to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
        discussion. Our query could be the next big thing others learn from. Get
        involved!"
            buttonLink="/ask-question"
            buttonTitle="Ask a Question"
          />
        )}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1} //searchParams se jo bhi aata hai woh string ke format mai aata hai, toh usko number mai convert karne ke liye yeh line use kar rahe hai hum
          // ? +searchParams.page : 1: This is a ternary operator that checks if searchParams?.page exists and converts it to a number (+searchParams.page). If searchParams?.page is null or undefined, it defaults to 1.
          isNext={result.isNext}
        />
      </div>
    </>
  );
}
