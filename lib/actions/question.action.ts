"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import {
  CreateQuestionParms,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
import { FilterQuery } from "mongoose";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 20 } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { questionTitle: { $regex: new RegExp(searchQuery, "i") } },
        { questionExplantion: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;

      case "frequent":
        sortOptions = { views: -1 };
        break;
      case "unanswered":
        query.answers = { $size: 0 };
      default:
        break;
    }

    const questions = await Question.find(query)
      .populate({ path: "questionTags", model: Tag })
      .populate({ path: "user", model: User })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions); //yeh mujhe latest question top pe return karta hai

    const totalQuestions = await Question.countDocuments(query);
    const isNext = totalQuestions > skipAmount + questions.length;
    return { questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createQuesiton(params: CreateQuestionParms) {
  try {
    connectToDatabase();

    const { questionTitle, questionExplantion, formTags, user, path } = params;

    // Create the question
    const question = await Question.create({
      questionTitle,
      questionExplantion,
      user,
    });

    const tagDocuments = [];

    // Create the tags or get them if they already exist
    for (const tag of formTags) {
      const existingTag = await Tag.findOneAndUpdate(
        { tagName: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { tagName: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );
      tagDocuments.push(existingTag._id);
    }
    await Question.findByIdAndUpdate(question._id, {
      $push: { questionTags: { $each: tagDocuments } },
    });

    // Create an interaction record for the user's ask_question action
    // Increment user's reputation by +5 points for creating a question

    revalidatePath(path); //yeh mujhe home page ko bar bar refresh na karna pade new questions dekhne ke liye usske liye madat karta hai
  } catch (error) {}
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDatabase();
    const { questionId } = params;
    const question = await Question.findById(questionId)
      .populate({
        path: "questionTags",
        model: Tag,
        select: "_id tagName", //yaha pe hum select kar sakte hai ki hame konse konse values chahiye Tags model se
      })
      .populate({
        path: "user",
        model: User,
        select: "_id clerkId fullName profilePicture",
      });
    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = {
        $addToSet: { upvotes: userId },
      };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // increment author's reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = {
        $addToSet: { downvotes: userId },
      };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // increment author's reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, path } = params;

    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId }); //Jo bhi answer selected question se associated hai unn sab ko bhi uda do
    await Interaction.deleteMany({ question: questionId }); //Jo bhi interaction(views,upvotes...) selected question se associated hai unn sab ko bhi uda do
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } } //sare tags ko bhi bata do ki yeh question delete ho gaya hai and apne ap ko woh questions se alag kar le
    );
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, title, content, path } = params;

    const question =
      await Question.findById(questionId).populate("questionTags");

    if (!question) {
      throw new Error("Question not found");
    }

    question.questionTitle = title;
    question.questionExplantion = content;

    await question.save();

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function getTopQuestions() {
  try {
    connectToDatabase();

    const topQuestions = await Question.find({})
      .sort({
        views: -1,
        upvotes: -1,
      })
      .limit(5); //showing the 5 questions with highest views and hightest upvotes in decending order
    return topQuestions;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
