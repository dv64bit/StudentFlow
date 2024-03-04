import HomeFilters from "@/components/home/HomeFilters";
import FilterComp from "@/components/shared/FilterComp";
import QuestionCard from "@/components/cards/QuestionCard";
import ResultNotFound from "@/components/shared/ResultNotFound";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filter";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { title } from "process";

const userQuestions = [
  {
    _id: "1",
    quesitonTitle:
      "Can anyone suggest me any good resource to learn about start-up laws?",
    questionTags: [
      { _id: "1", name: "SOL" },
      { _id: "2", name: "LAW" },
    ],
    user: {
      _id: "1",
      name: "Darshan Verma",
      pictureUrl:
        "https://images.unsplash.com/photo-1570158268183-d296b2892211?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    upvotes: 1123500,
    views: 100,
    answers: [],
    createdAt: new Date("2024-02-15T12:00:00.000Z"),
  },
  {
    _id: "2",
    quesitonTitle: "I want to switch my course in ITDS from CTIS!",
    questionTags: [
      { _id: "1", name: "SOE" },
      { _id: "2", name: "CSE" },
      { _id: "3", name: "ITDS" },
      { _id: "4", name: "CTIS" },
    ],
    user: {
      _id: "2",
      name: "Shita Kumar",
      pictureUrl:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    upvotes: 50,
    views: 1200,
    answers: [],
    createdAt: new Date("2024-02-15T12:00:00.000Z"),
  },
];

export default function Home() {
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
          route="/"
          iconPos="left"
          iconSrc="/assets/icons/search.svg"
          placeholder="Search your query..."
          otherClasses="flex-1"
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
        {userQuestions.length > 0 ? (
          userQuestions.map((questions) => (
            <QuestionCard
              key={questions._id}
              _id={questions._id}
              quesitonTitle={questions.quesitonTitle}
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
    </>
  );
}
