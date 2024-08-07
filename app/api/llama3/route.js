import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import "dotenv/config";

// export async function main() {
//   const chatCompletion = await POST([
//     "eggs",
//     "spinach",
//     "onions",
//     "bread",
//     "avocado",
//     "chocolate",
//     "banana",
//   ]);
//   // Print the completion returned by the LLM.
//   console.log(chatCompletion.choices[0]?.message?.content || "");
//   // return chatCompletion.choices[0]?.message?.content || "";
// }

export async function POST(req) {
  console.log("POST /api/llama");

  const groq = new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  });
  const data = await req.json();
  const itemList = data["ingredients"].join(", ");
  const instructions = data["instruction"];
  const fullPrompt = `${instructions} Here is a list of items: ${itemList}`;
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a chef that is knowledgable in cooking and recipes and can only respond with either potential recipes given a list of ingredients or the steps required to make the dish. You are only allowed to say the name of the dish or the steps required to make it. Try to provide up to 5 recipes if you are being told to say the names of dishes possible, but less is fine, given the ingredients provided. Also, when listing out the recipes, don't use the words to be grammatically correct, and don't use periods. If you are being told to list out dish names (AKA recipes), then separate each recipe with a comma. If you are being asked to give the instructions, leave it in paragraph format, do not try to make it a list or in bullet point format.",
      },
      {
        role: "user",
        content: fullPrompt,
      },
    ],
    model: "llama3-8b-8192",
  });
  // console.log(completion.choices[0].message);
  return NextResponse.json({ message: completion.choices[0].message.content });
}

// main().catch(console.error);
