import { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  username: string;
  fullName: string;
  email: string;
  password?: string;
  bio?: string;
  profilePicture: string;
  location?: string;
  anyLink?: string;
  fame?: number;
  savedQuestion: Schema.Types.ObjectId[];
  joinedAt: Date;
  answers: Schema.Types.ObjectId[];
  course: string;
  specialization: string;
  college: string;
}

const UserSchema: Schema<IUser> = new Schema({
  clerkId: { type: String, required: true },
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  bio: { type: String },
  profilePicture: { type: String, required: true },
  location: { type: String },
  anyLink: { type: String },
  fame: { type: Number, default: 0 },
  savedQuestion: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  joinedAt: { type: Date, required: true },
  answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
  course: { type: String, required: true },
  specialization: { type: String, required: true },
  college: { type: String, required: true },
});

const User = models.User || model("User", UserSchema); //using this line we are first check if the User models already exist in DB or not, and if it exist the we are going to create it

export default User;
