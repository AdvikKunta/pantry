import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

// export async function main() {
//   const chatCompletion = await getGroqChatCompletion([
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
//   return chatCompletion.choices[0]?.message?.content || "";
// }

export async function getGroqChatCompletion(items) {
  const itemList = items.join(", ");
  const prompt =
    "With the ingredients that are going to be listed at the end of the message, create as many recipes as you can (they must be real dishes and doable with only the ingredients listed) and separate each dish with the # delimiter. Give this to me in a format that has only the dish's name then a colon then instructions on how to make it. If there are no items for ingredients (as in if the ingredients I give you cannot make anything, or if it's an empty list of ingredients), just return an empty string, don't create anything unnecessarily. Ensure that you do not say anything outside of the contents that I've specifically told you, so that if I wanted to extract this response and convert it to a string I shouldn't have to do any additional processing to remove your words from the relevant words. Don't introduce the prompt, your question or the fact that you are giving me recipes, and don't give me a concluding sentence either.";
  const fullPrompt = `${prompt} Here is a list of items: ${itemList}`;
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: fullPrompt,
      },
    ],
    model: "llama3-8b-8192",
  });
}

// main().catch(console.error);
