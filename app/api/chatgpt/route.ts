import { NextResponse } from "next/server";

import OpenAI from "openai";

const openai = new OpenAI();

export const POST = async (request: Request) => {
  const { question } = await request.json();
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a knowlegeable assistant that provides quality information.",
          },
          {
            role: "user",
            content: `Tell me ${question}`,
          },
        ],
      }),
    });

    const responseData = await response.json();
    const reply = responseData.choices[0].message.content;

    return NextResponse.json({ reply });

    // const completion = await openai.chat.completions.create({
    //   messages: [{ role: "system", content: "You are a helpful assistant." }],
    //   model: "gpt-3.5-turbo",
    // });

    // console.log(completion.choices[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
