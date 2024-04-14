import EditProfileForm from "@/components/forms/EditProfileForm";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import console from "console";

const Page = async ({ params }: ParamsProps) => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const mongoLoggedInUser = await getUserById({ userId });

  const result = await getQuestionById({ questionId: params.id });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <div className="mt-9">
        <EditProfileForm
          clerkId={userId}
          user={JSON.stringify(mongoLoggedInUser)}
        />
      </div>
    </>
  );
};

export default Page;
