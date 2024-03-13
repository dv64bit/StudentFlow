"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import { CreateQuestionParms, GetQuestionsParams } from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();

    const questions = await Question.find({})
      .populate({ path: "questionTags", model: Tag })
      .populate({ path: "user", model: User })
      .sort({ createdAt: -1 }); //yeh mujhe latest question top pe return karta hai
    return { questions };
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
