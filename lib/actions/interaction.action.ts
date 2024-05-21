"use server";

import Question from "@/database/question.model";
import { ViewQuestionParams } from "./shared.types";
import { connectToDatabase } from "../mongoose";
import Interaction from "@/database/interaction.model";

// This interaction increase the view of the question
export async function viewQuestion(params: ViewQuestionParams) {
  try {
    await connectToDatabase();
    const { questionId, userId } = params;

    // Update view count for the question
    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

    // Here we are checking if the user has already viewed the question
    if (userId) {
      const checkexistingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });
      if (checkexistingInteraction) {
        return console.log("User has already viewed");
      }

      //   If there is no previous interaction is done with the question then we will create the interaction
      //   Create interaction
      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
