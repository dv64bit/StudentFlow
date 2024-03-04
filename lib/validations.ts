import { z } from "zod";

export const QuestionsFormSchema = z.object({
  title: z.string().min(5).max(130),
  explanation: z.string().min(100),
  tags: z.array(z.string().min(1).max(15)).min(1).max(4), //tags array ke form mai store honge->tags ki length minimun 1 se le kar maximum 15 characters ki hogi-> minimum number of tags 1 and maximum 4 honge ek question mai
});
