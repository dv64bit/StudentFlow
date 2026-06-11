import { Schema, model, models, Document } from "mongoose";

// Define the interface for the tag
export interface ITag extends Document {
  tagName: string;
  description: string;
  questions: Schema.Types.ObjectId[]; //this will let the tag know that it is created by which question
  followers: Schema.Types.ObjectId[]; //this will store the array of users who are following this tag so that in future any question appears related to this tag, then it should be visible to the followers of that tag
  createdOn: Date;
}

// Define the schema for the tag
const TagSchema: Schema<ITag> = new Schema({
  tagName: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }], // Assuming 'Question' is the model name for the question schema
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }], // Assuming 'User' is the model name for the user schema
  createdOn: { type: Date, default: Date.now },
});

// Create and export the Tag model
const Tag = models.Tag || model("Tag", TagSchema); //using this line we are first check if the Tag models already exist in DB or not, and if it exist the we are going to create it
export default Tag;
