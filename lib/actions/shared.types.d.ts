// kyuki hame baar baar interface define na karna pade code mai isliye hum ek jagha par store karke rakh de rahe hai
import { IUser } from "@/database/user.model";
import { Schema } from "mongoose";

export interface CreateQuestionParms {
  questionTitle: string;
  questionExplantion: string;
  formTags: string[];
  user: Schema.Types.ObjectId | IUser;
  path: string;
}

export interface CreateAnswerParams {
  content: string;
  user: string; // User ID
  question: string; // Question ID
  path: string;
}

export interface GetAnswersParams {
  questionId: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

export interface AnswerVoteParams {
  answerId: string;
  userId: string;
  hasupVoted: boolean;
  hasdownVoted: boolean;
  path: string;
}

export interface GetQuestionsParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filter?: string;
}

export interface RecommendedParams {
  userId: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}

export interface EditQuestionParams {
  questionId: string;
  title: string;
  content: string;
  path: string;
}

export interface DeleteQuestionParams {
  questionId: string;
  path: string;
}

export interface DeleteAnswerParams {
  answerId: string;
  path: string;
}

export interface GetQuestionByIdParams {
  questionId: string;
}

export interface QuestionVoteParams {
  questionId: string;
  userId: string;
  hasupVoted: boolean;
  hasdownVoted: boolean;
  path: string;
}

export interface ToggleSaveQuestionParams {
  userId: string;
  questionId: string;
  path: string;
}

export interface CreateUserParams {
  clerkId: string;
  fullName: string;
  username: string;
  email: string;
  profilePicture: string;
}

export interface UpdateUserParams {
  clerkId: string;
  updateData: Partial<IUser>;
  path: string;
}

export interface DeleteUserParams {
  clerkId: string;
}

export interface GetAllUsersParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string; // Add searchQuery parameter
}

export interface GetUserByIdParams {
  userId: string;
}

export interface GetSavedQuestionsParams {
  clerkId: string;
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}

export interface GetTopInteractedTagsParams {
  userId: string;
  limit?: number;
}

export interface GetAllTagsParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}

export interface GetQuestionsByTagIdParams {
  tagId: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}

export interface ViewQuestionParams {
  questionId: string;
  userId: string | undefined;
}

export interface GetUserStatsParams {
  userId: string;
  page?: number;
  pageSize?: number;
}

export interface SearchParams {
  query?: string | null;
  type?: string | null;
}

export interface JobFilterParams {
  query: string;
  page: string;
}
