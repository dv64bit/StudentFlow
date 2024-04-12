import Link from "next/link";
import React from "react";
import TagHolder from "../shared/TagHolder";
import Matric from "../shared/Matric";
import { formatNumber, getCreatedTimeStamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";

interface QuestionProps {
  clerkId?: string | null;
  _id: string;
  quesitonTitle: string;
  questionTags: {
    _id: string;
    tagName: string;
  }[];
  user: {
    clerkId: string;
    _id: string;
    fullName: string;
    profilePicture: string;
  };
  upvotes: string[];
  views: number;
  answers: Array<object>; //answer contain array of objects
  createdAt: Date;
}

const QuestionCard = ({
  clerkId,
  _id,
  quesitonTitle,
  questionTags,
  user,
  upvotes,
  views,
  answers,
  createdAt,
}: QuestionProps) => {
  const showActionButtons = clerkId && clerkId === user.clerkId; //agar clerkId jo aai hai woh agar loggedIn user ke clerkId se milti hai tabhi ActionButton show karo

  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div className="createdDate">
          {/* For more detil to understand the below timestamp method read the useful Understanding notes */}
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getCreatedTimeStamp(createdAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className="quesitonTitle sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {quesitonTitle}
            </h3>
          </Link>
        </div>
        {/* If signed in add edit option to edit/delete the question */}
        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction type="Question" itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>

      <div className="questionTagsHolder mt-3.5 flex flex-wrap gap-2">
        {questionTags.map((tag) => (
          <TagHolder key={tag._id} _id={tag._id} name={tag.tagName} />
        ))}
      </div>
      <div className="metadataMatric flex-between mt-6 w-full flex-wrap gap-3">
        {/* This metric is created for the User section */}
        <Matric
          imgUrl={user.profilePicture}
          alt="User"
          value={user.fullName}
          title={`- asked ${getCreatedTimeStamp(createdAt)}`}
          href={`/profile/${user._id}`}
          isUser
          textStyle="body-medium text-dark400_light800"
        />

        {/* This metric is created for the Votes section */}
        <Matric
          imgUrl="/assets/icons/like.svg"
          alt="Upvotes"
          value={formatNumber(upvotes.length)}
          title=" Votes"
          textStyle="small-medium text-dark400_light800"
        />
        {/* This metric is created for the Answers section */}
        <Matric
          imgUrl="/assets/icons/message.svg"
          alt="Answers"
          value={formatNumber(answers.length)}
          title=" Answers"
          textStyle="small-medium text-dark400_light800"
        />
        {/* This metric is created for the Views section */}
        <Matric
          imgUrl="/assets/icons/eye.svg"
          alt="Views"
          value={formatNumber(views)}
          title=" Views"
          textStyle="small-medium text-dark400_light800"
        />
      </div>
    </div>
  );
};

export default QuestionCard;
