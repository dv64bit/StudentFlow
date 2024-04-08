import Answer from "@/components/forms/Answer";
import AllAnswers from "@/components/shared/AllAnswers";
import Matric from "@/components/shared/Matric";
import ParseHTML from "@/components/shared/ParseHTML";
import TagHolder from "@/components/shared/TagHolder";
import Votes from "@/components/shared/Votes";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { formatNumber, getCreatedTimeStamp } from "@/lib/utils";
import { URLProps } from "@/types";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page = async ({ params, searchParams }: URLProps) => {
  const { userId: clerkId } = auth();

  let mongoUser;

  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
  }

  const result = await getQuestionById({ questionId: params.id });

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${result.user.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={result.user.profilePicture}
              className="rounded-full"
              width={22}
              height={22}
              alt="profile"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {result.user.fullName}
            </p>
          </Link>
          <div className="flex justify-end">
            <Votes
              type="Question"
              itemId={JSON.stringify(result._id)}
              userId={JSON.stringify(mongoUser._id)}
              upvotes={result.upvotes.length}
              hasupVoted={result.upvotes.includes(mongoUser._id)}
              downvotes={result.downvotes.length}
              hasdownVoted={result.downvotes.includes(mongoUser._id)}
              hasSaved={mongoUser?.savedQuestion.includes(result._id)}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {result.questionTitle}
        </h2>
        ̥
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Matric
          imgUrl="/assets/icons/clock.svg"
          alt="Upvotes"
          value={` asked ${getCreatedTimeStamp(result.createdAt)}`}
          title=" Asked"
          textStyle="small-medium text-dark400_light800"
        />
        {/* This metric is created for the Answers section */}
        <Matric
          imgUrl="/assets/icons/message.svg"
          alt="Answers"
          value={formatNumber(result.answers.length)}
          title=" Answers"
          textStyle="small-medium text-dark400_light800"
        />
        {/* This metric is created for the Views section */}
        <Matric
          imgUrl="/assets/icons/eye.svg"
          alt="Views"
          value={formatNumber(result.views)}
          title=" Views"
          textStyle="small-medium text-dark400_light800"
        />
      </div>
      <ParseHTML data={result.questionExplantion} />
      <div className="mt-8 flex flex-wrap gap-2">
        {result.questionTags.map((tag: any) => (
          <TagHolder
            key={tag._id}
            _id={tag._id}
            name={tag.tagName}
            showCount={false}
          />
        ))}
      </div>
      <AllAnswers
        questionId={result._id}
        userId={mongoUser._id}
        totalAnswers={result.answers.length}
      />
      <Answer
        question={result.questionExplantion}
        questionId={JSON.stringify(result._id)}
        userId={JSON.stringify(mongoUser._id)}
      />
    </>
  );
};

export default Page;
