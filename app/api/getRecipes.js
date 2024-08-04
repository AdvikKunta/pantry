import { getGroqChatCompletion } from "./llama3/route.mjs";

export default async function GET(req, res) {
  if (req.method === "POST") {
    try {
      const { ingredients } = req.body;
      const recipes = await getGroqChatCompletion(ingredients);
      res.status(200).json(recipes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recipes" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
