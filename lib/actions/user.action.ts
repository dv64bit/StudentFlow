"use server";

import { FilterQuery } from "mongoose";
import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";

// Yeh function hame database se user find karne mai help kar rha hai
export async function getUserById(params: GetUserByIdParams) {
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
export async function createUser(userData: CreateUserParams) {
  //CreateUserParams shared.types.d.ts mai maine userParam ke type ko define kiya hai
  try {
    connectToDatabase();
    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Yeh function hame database mai user update karne mai help kar rha hai
export async function updateUser(params: UpdateUserParams) {
  //CreateUserParams shared.types.d.ts mai maine userParam ke type ko define kiya hai
  try {
    connectToDatabase();
    const { clerkId, updateData, path } = params;
    await User.findOneAndUpdate({ clerkId }, updateData, {
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

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();
    // const { page = 1, pageSize = 20, filter, searchQuery } = params;
    const users = await User.find({}).sort({ createdAt: -1 });
    return { users };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase();
    const { userId, questionId, path } = params;
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }
    const isQuestionSaved = user.savedQuestion.includes(questionId);

    if (isQuestionSaved) {
      // remove question from saved
      await User.findByIdAndUpdate(
        userId,
        { $pull: { savedQuestion: questionId } },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { savedQuestion: questionId } },
        { new: true }
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase();

    const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    const user = await User.findOne({ clerkId }).populate({
      path: "savedQuestion",
      match: query,
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "questionTags", model: Tag, select: "_id tagName" },
        {
          path: "user",
          model: User,
          select: "_id clerkId fullName profilePicture",
        },
      ],
    });
    if (!user) {
      throw new Error("User not found");
    }

    const savedQuestion = user.savedQuestion;
    return { questions: savedQuestion };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getLoggedInUserInfo(params: GetUserByIdParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User not found");
    }
    const totalQuestions = await Question.countDocuments({ user: user._id });
    const totalAnswers = await Answer.countDocuments({ user: user._id });
    return {
      user,
      totalAnswers,
      totalQuestions,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUsersQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;

    const totalUserQuestions = await Question.countDocuments({ user: userId });

    const userAskedQuestions = await Question.find({ user: userId })
      .sort({
        views: -1,
        upvotes: -1,
      })
      .populate("questionTags", "_id tagName")
      .populate("user", "_id clerkId fullName profilePicture");

    return { totalUserQuestions, questions: userAskedQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUsersAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;

    const totalUserAnswers = await Answer.countDocuments({ user: userId });

    const userAnswers = await Answer.find({ user: userId })
      .sort({
        upvotes: -1,
      })
      .populate("question", "_id questionTitle")
      .populate("user", "_id clerkId fullName profilePicture");

    return { totalUserAnswers, answers: userAnswers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// export async function getAllUsers(params: GetAllUsersParams) {
//   try {
//     connectToDatabase();
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }
