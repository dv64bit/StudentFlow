import { Schema, model, models, Document } from "mongoose";

export interface IQuestion extends Document {
  title: string;
  questionExplantion: string;
  questionTags: Schema.Types.ObjectId[]; //kyuki tags ek se zyda honge and unka ek seperate model create hoga isliye unko hum dusre model se refrence karenge
  views: number;
  upvotes: Schema.Types.ObjectId[]; //upvotes bhi user model ko refrence karenge kyuki konse konse user ne upvotes kiya hai woh pata rehna chahiye
  downvotes: Schema.Types.ObjectId[];
  user: Schema.Types.ObjectId; //kyuki user sirf ek hei rahega isliye uski objectId hum array mai store nahi karenge
  answers: Schema.Types.ObjectId[]; //ek question ke multiple answer ho sakte hai isliye jisne bhi question ka answer diya hai unsabki objectid hum isse denge
  createdAt: Date;
}

const QuestionSchema = new Schema({
  title: { type: String, require: true },
  questionExplantion: { type: String, require: true },
  questionTags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  views: { type: Number, default: 0 },
  upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  user: { type: Schema.Types.ObjectId, ref: "User" },
  answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
  createdAt: { type: Date, default: Date.now },
});

const Question = models.Question || model("Question", QuestionSchema); //using this line we are first check if the Question models already exist in DB or not, and if it exist the we are going to create it

export default Question;
