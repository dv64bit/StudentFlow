"use server";

import { connectToDatabase } from "../mongoose";

export async function createQuesiton(params: any) {
  // eslint-disable-next-line no-empty
  try {
    connectToDatabase();
  } catch (error) {}
}
