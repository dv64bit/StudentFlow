import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser, deleteUser, updatedUser } from "@/lib/actions/user.action";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.NEXT_CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const eventType = evt.type; //jo bhi event huva hai clerk side pe usse usse eventType pe store karo

  console.log({ eventType });

  //   Here we are getting all the user event data
  if (eventType === "user.created") {
    //agar user create hota hai tab mujhe
    const { id, email_addresses, image_url, username, first_name, last_name } =
      evt.data; //created user ki sari information mujhe la kar do

    // jo bhi information maine retrive ki hai evt.data se uski madat se mai server action ko use kar ke apne database mai user create karna chahunga

    // Create a new user in your database
    const mongoUser = await createUser({
      clerkId: id,
      fullName: `${first_name}${last_name ? `${last_name}` : ""}`,
      username: username!,
      email: email_addresses[0].email_address,
      profilePicture: image_url,
    });
    return NextResponse.json({ message: "OK", user: mongoUser });
  }
  if (eventType === "user.updated") {
    //agar user mai kuch update hota hai tab mujhe
    const { id, email_addresses, image_url, username, first_name, last_name } =
      evt.data;
    const mongoUser = await updatedUser({
      clerkId: id,
      updatedData: {
        fullName: `${first_name}${last_name ? `${last_name}` : ""}`,
        username: username!,
        email: email_addresses[0].email_address,
        profilePicture: image_url,
      },
      path: `/profile/${id}`,
    });
    return NextResponse.json({ message: "OK", user: mongoUser });
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;
    const deletedUser = await deleteUser({
      clerkId: id!,
    });
    return NextResponse.json({ message: "OK", user: deletedUser });
  }

  return new Response("", { status: 201 });
}
