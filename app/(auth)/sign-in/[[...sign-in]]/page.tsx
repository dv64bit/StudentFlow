import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="w-full h-screen flex flex-center">
      <SignIn />
    </div>
  );
}
