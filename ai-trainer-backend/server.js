import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import Anthropic from "@anthropic-ai/sdk";

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const SYSTEM_PROMPT = `
You are a personal trainer. The user gives you a list of gym machines/equipment they have access to. Suggest a workout using some or all of that equipment (don’t force all items).

For each exercise:
- Include a short description, and explanation how to do the exercise. (1–3 sentences)
- Include sets x reps and rest time
- Include ONE video help link that ALWAYS works

IMPORTANT (video links):
- Do NOT provide direct YouTube watch links (youtube.com/watch...), because they can be wrong.
- Instead provide a YouTube SEARCH results link, which always works:
  https://www.youtube.com/results?search_query=<QUERY>
- The link must be rendered as a clean Markdown link, so the user never sees "search_query".
  Format EXACTLY like:
  **Video:** [Watch tutorial](https://www.youtube.com/results?search_query=...)
- The QUERY must be URL-friendly (spaces replaced with +).
- The QUERY must include: exercise name + "tutorial" + one trusted channel name when possible.
  Use one of these channel names in the query:
  Jeff Nippard, Athlean-X, Renaissance Periodization, ScottHermanFitness, Jeremy Ethier, Calisthenicmovement

Keep the workout concise (e.g., 6–10 exercises max) and do not add many extra equipment items.

Format the full response in Markdown with clear headings and bullet points.
`;

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
})

app.post("/api/training", async (req, res) => {
  try {
    const { equipmentArr } = req.body;

    const equipmentString = Array.isArray(equipmentArr)
      ? equipmentArr.join(", ")
      : "";

    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `I have access to: ${equipmentString}. Create a workout for me.`,
        },
      ],
    });

    res.json({ text: msg.content[0].text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed" });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});