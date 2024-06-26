"use client";
import { AnswerSchema } from "@/lib/validations";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "@/context/ThemeProvider";
import { Button } from "../ui/button";
import Image from "next/image";
import { createAnswer } from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";

interface Props {
  question: string;
  questionId: string;
  userId: string;
}

const Answer = ({ question, questionId, userId }: Props) => {
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingAI, setSetIsSubmittingAI] = useState(false);
  const { mode } = useTheme();
  const editorRef = useRef(null);
  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: "",
    },
  });

  const handleCreateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
    setIsSubmitting(true);

    try {
      await createAnswer({
        content: values.answer,
        user: JSON.parse(userId),
        question: JSON.parse(questionId),
        path: pathname,
      });

      form.reset();
      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateAIAnswer = async () => {
    if (!userId) {
      return;
    }
    setSetIsSubmittingAI(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`,
        {
          method: "POST",
          body: JSON.stringify({ question }),
        }
      );
      const aiAnswer = await response.json();

      alert("Feature is under Development");

      // console.log(aiAnswer);

      const formattedAnswer = aiAnswer.reply.replace(/\n/g, "<br/>");

      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent(formattedAnswer);
      }

      // Toast...
    } catch (error) {
      console.log(error);
    } finally {
      setSetIsSubmittingAI(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
        <Button
          className="bg-light-800 dark:bg-dark-300 light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-100"
          onClick={generateAIAnswer}
        >
          {isSubmittingAI ? (
            <>Generating...</>
          ) : (
            <>
              <Image
                src="/assets/icons/stars.svg"
                alt="Ai Button"
                width={12}
                height={12}
                className="object-contain"
              />
              Generate an AI Answer
            </>
          )}
        </Button>
      </div>
      <Form {...form}>
        <form
          className="mt-6 flex w-full flex-col gap-10"
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                {/* <FormLabel className="text-[16px] font-semibold leading-[20.8px] text-dark400_light800">
                  Write your Answer here
                  <span className="text-primary-500"> *</span>
                </FormLabel> */}
                <FormControl className="mt-3.5">
                  {/* added a question explaination editor */}
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINYEDITOR_API_KEY}
                    onInit={(evt, editor) => {
                      // @ts-ignore
                      editorRef.current = editor;
                    }}
                    init={{
                      height: 350,
                      menubar: false,
                      plugins:
                        "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker ",
                      toolbar:
                        "undo redo | blocks fontfamily fontsize | codesample bold italic underline strikethrough | link image media | spellcheckdialog | align lineheight |  numlist bullist indent outdent | emoticons charmap | removeformat",
                      content_style:
                        "body {font-family: Intern;font-size:16px}",
                      // tinycomments_mode: "embedded",
                      // tinycomments_author: "Author name",
                      // mergetags_list: [
                      //   { value: "First.Name", title: "First Name" },
                      //   { value: "Email", title: "Email" },
                      // ],
                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode === "dark" ? "dark" : "light",
                      //@ts-ignore
                    }}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                  />
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  The answer must be minimum of 100 characters.
                </FormDescription>
                <FormMessage className="text-rose-600" />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Answer;
