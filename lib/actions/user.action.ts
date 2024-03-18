"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

// Yeh function hame database se user find karne mai help kar rha hai
export async function getUserById(params: any) {
  try {
    connectToDatabase();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Yeh function hame database mai user create karne mai help kar rha hai
export async function createUser(userParam: CreateUserParams) {
  //CreateUserParams shared.types.d.ts mai maine userParam ke type ko define kiya hai
  try {
    connectToDatabase();
    const newUser = await User.create(userParam);
    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Yeh function hame database mai user update karne mai help kar rha hai
export async function updatedUser(params: UpdateUserParams) {
  //CreateUserParams shared.types.d.ts mai maine userParam ke type ko define kiya hai
  try {
    connectToDatabase();
    const { clerkId, updatedData, path } = params;
    await User.findOneAndUpdate({ clerkId }, updatedData, {
      new: true,
    });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Yeh function hame database mai user delete karne mai help kar rha hai
export async function deleteUser(params: DeleteUserParams) {
  //CreateUserParams shared.types.d.ts mai maine userParam ke type ko define kiya hai
  try {
    connectToDatabase();
    const { clerkId } = params;
    const user = await User.findOneAndDelete({ clerkId });
    if (!user) {
      throw new Error("User not found");
    }
    // Hum user ko database delete karnege
    // jiske sath usse related sare questions, answers, commment sab chalejayenge

    // get user question ids
    const userQuestionIds = await Question.find({ user: user._id }).distinct(
      "_id"
    );

    // delete user questions
    await Question.deleteMany({ user: user._id });

    // TODO: delete user answers , comments, etc.
    const deletedUser = await User.findByIdAndDelete(user._id);
    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
