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
import { BadgeCriteriaType } from "@/types";
import { assignBadges } from "../utils";

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

    const { searchQuery, filter, page = 1, pageSize = 20 } = params;
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof User> = {};

    if (searchQuery) {
      query.$or = [
        { fullName: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
        { course: { $regex: new RegExp(searchQuery, "i") } },
        { specialization: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "new_users":
        sortOptions = { joinedAt: -1 };
        break;
      case "old_users":
        sortOptions = { joinedAt: 1 };
        break;
      case "top_contributors":
        sortOptions = { reputation: -1 };
        break;

      default:
        break;
    }

    const users = await User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsers = await User.countDocuments(query);
    const isNext = totalUsers > skipAmount + users.length;

    return { users, isNext };
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

    const { clerkId, searchQuery, filter, page = 1, pageSize = 20 } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { questionTitle: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    // const query: FilterQuery<typeof Question> = {};

    // if (searchQuery) {
    //   query.$or = [
    //     { questionTitle: { $regex: new RegExp(searchQuery, "i") } },
    //     { questionExplantion: { $regex: new RegExp(searchQuery, "i") } },
    //   ];
    // }

    let sortOptions = {};

    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: -1 };
        break;
      case "most_voted":
        sortOptions = { upvotes: -1 };
        break;
      case "most_viewed":
        sortOptions = { views: -1 };
        break;
      case "most_answered":
        sortOptions = { answers: -1 };
        break;

      default:
        break;
    }

    const user = await User.findOne({ clerkId }).populate({
      path: "savedQuestion",
      match: query,
      options: {
        sort: sortOptions,
        skip: skipAmount,
        limit: pageSize + 1,
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

    const isNext = user.savedQuestion.length > pageSize;

    if (!user) {
      throw new Error("User not found");
    }

    const savedQuestion = user.savedQuestion;
    return { questions: savedQuestion, isNext };
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

    // Total upvotes
    const [questionUpvotes] = await Question.aggregate([
      { $match: { user: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const [answerUpvotes] = await Answer.aggregate([
      { $match: { user: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);
    // Views
    const [questionViews] = await Answer.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
        },
      },
    ]);

    /**
     * Badge system
     */
    // Criteria

    const criteria = [
      {
        type: "QUESTION_COUNT" as BadgeCriteriaType,
        count: totalQuestions,
      },
      {
        type: "ANSWER_COUNT" as BadgeCriteriaType,
        count: totalAnswers,
      },
      {
        type: "QUESTION_UPVOTES" as BadgeCriteriaType,
        count: questionUpvotes?.totalUpvotes || 0,
      },
      {
        type: "ANSWER_UPVOTES" as BadgeCriteriaType,
        count: answerUpvotes?.totalUpvotes || 0,
      },
      {
        type: "TOTAL_VIEWS" as BadgeCriteriaType,
        count: questionViews?.totalViews || 0,
      },
    ];

    const badgeCounts = assignBadges({ criteria });

    return {
      user,
      totalAnswers,
      totalQuestions,
      badgeCounts,
      reputation: user.reputation,
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

    const skipAmount = (page - 1) * pageSize;

    const totalUserQuestions = await Question.countDocuments({ user: userId });

    const userAskedQuestions = await Question.find({ user: userId })
      .sort({
        createdAt: -1,
        views: -1,
        upvotes: -1,
      })
      .populate("questionTags", "_id tagName")
      .populate("user", "_id clerkId fullName profilePicture")
      .limit(pageSize)
      .skip(skipAmount);

    const isNext = totalUserQuestions > skipAmount + userAskedQuestions.length;

    return { totalUserQuestions, questions: userAskedQuestions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUsersAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;

    const totalUserAnswers = await Answer.countDocuments({ user: userId });

    const userAnswers = await Answer.find({ user: userId })
      .sort({
        createdAt: -1,
        upvotes: -1,
      })
      .populate("question", "_id questionTitle")
      .populate("user", "_id clerkId fullName profilePicture")
      .limit(pageSize)
      .skip(skipAmount);

    const isNextAnswer = totalUserAnswers > skipAmount + userAnswers.length;

    return { totalUserAnswers, answers: userAnswers, isNextAnswer };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUserInDB(params: UpdateUserParams) {
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

// export async function getAllUsers(params: GetAllUsersParams) {
//   try {
//     connectToDatabase();
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }
