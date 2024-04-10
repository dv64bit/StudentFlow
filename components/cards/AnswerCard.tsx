import Link from "next/link";

import { SignedIn } from "@clerk/nextjs";
import { formatNumber, getCreatedTimeStamp } from "@/lib/utils";
import Matric from "../shared/Matric";

interface Props {
  clerkId?: string | null;
  _id: string;
  question: {
    _id: string;
    questionTitle: string;
  };
  user: {
    _id: string;
    clerkId: string;
    fullName: string;
    profilePicture: string;
  };
  upvotes: number;
  createdAt: Date;
}

const AnswerCard = ({
  clerkId,
  _id,
  question,
  user,
  upvotes,
  createdAt,
}: Props) => {
  const showActionButtons = clerkId && clerkId === user.clerkId;

  return (
    <div className="card-wrapper rounded-[10px] px-11 py-9">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <Link href={`/question/${question._id}/#${_id}`}>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getCreatedTimeStamp(createdAt)}
          </span>
          <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
            {question.questionTitle}
          </h3>
        </Link>

        {/* Delete
        // <SignedIn>
        //   {showActionButtons && (
        //     <EditDeleteAction type="answer" itemId={JSON.stringify(_id)} />
        //   )}
        // </SignedIn> */}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Matric
          imgUrl={user.profilePicture}
          alt="user avatar"
          value={user.fullName}
          title={` • asked ${getCreatedTimeStamp(createdAt)}`}
          href={`/profile/${user.clerkId}`}
          textStyle="body-medium text-dark400_light700"
          isUser
        />

        <div className="flex-center gap-3">
          <Matric
            imgUrl="/assets/icons/like.svg"
            alt="like icon"
            value={formatNumber(upvotes)}
            title=" Votes"
            textStyle="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
