import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `
You are a personal trainer. The user provides:
1. Available gym equipment
2. Target body part(s) to train
3. Workout duration
4. Any injuries or limitations

CRITICAL: You MUST create a workout that trains ONLY the specified target body part(s). Do not include exercises for other muscle groups unless they are compound movements that primarily target the requested muscles.

For each exercise:
- Include a short description and how to perform it (1-3 sentences)
- Include sets x reps and rest time
- Include ONE video help link that ALWAYS works
- If injuries/limitations are provided, avoid exercises that could aggravate them

IMPORTANT (video links):
- Do NOT provide direct YouTube watch links (youtube.com/watch...)
- Instead provide a YouTube SEARCH results link:
  https://www.youtube.com/results?search_query=<QUERY>
- Format as: **Video:** [Watch tutorial](https://www.youtube.com/results?search_query=...)
- QUERY must be URL-friendly (spaces = +)
- Include: exercise name + "tutorial" + trusted channel (Jeff Nippard, Athlean-X, Renaissance Periodization, ScottHermanFitness, Jeremy Ethier, Calisthenicmovement)

Keep workouts concise (6-10 exercises) and use primarily the provided equipment.
Format in Markdown with clear headings.
`;

// const SYSTEM_PROMPT = `
// You are a personal trainer. The user gives you a list of gym machines/equipment they have access to. Suggest a workout using some or all of that equipment (don’t force all items).

// For each exercise:
// - Include a short description, and explanation how to do the exercise. (1–3 sentences)
// - Include sets x reps and rest time
// - Include ONE video help link that ALWAYS works
// - If injuries/limitations are provided, avoid exercises that could aggravate them and suggest safer alternatives, and provide very short explanation why the exercises you picked are safe for their injury

// IMPORTANT (video links):
// - Do NOT provide direct YouTube watch links (youtube.com/watch...), because they can be wrong.
// - Instead provide a YouTube SEARCH results link, which always works:
//   https://www.youtube.com/results?search_query=<QUERY>
// - The link must be rendered as a clean Markdown link, so the user never sees "search_query".
//   Format EXACTLY like:
//   **Video:** [Watch tutorial](https://www.youtube.com/results?search_query=...)
// - The QUERY must be URL-friendly (spaces replaced with +).
// - The QUERY must include: exercise name + "tutorial" + one trusted channel name when possible.
//   Use one of these channel names in the query:
//   Jeff Nippard, Athlean-X, Renaissance Periodization, ScottHermanFitness, Jeremy Ethier, Calisthenicmovement

// Keep the workout concise (e.g., 6–10 exercises max) and do not add many extra equipment items.

// Format the full response in Markdown with clear headings and bullet points.
// `;

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("❌ Missing ANTHROPIC_API_KEY (check your backend .env or Vercel env vars)");
  process.exit(1);
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Test Route
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/training", async (req, res) => {
  try {
    const { equipmentArr, bodyPart, injury, duration } = req.body;

    const equipmentString = Array.isArray(equipmentArr)
      ? equipmentArr.join(", ")
      : "None";

    const target = (bodyPart || "Full body").toString().trim();
    const length = (duration || "45 min").toString().trim();
    const limitations = injury?.toString().trim() ? injury.toString().trim() : "None";

//     const userPrompt = `
// Equipment available: ${equipmentString}

// Target body part: ${target}
// Workout duration: ${length}
// Injuries/limitations: ${limitations}

// Create a workout that matches the target body part and workout duration.
// If injuries/limitations are provided, avoid exercises that could aggravate them and suggest safer alternatives.
// `.trim();

const userPrompt = `
You are a professional fitness trainer creating a workout plan.

CLIENT INFORMATION
- Available equipment: ${equipmentString}
- Target muscle group(s): ${target}
- Workout duration: ${length}
- Injuries or physical limitations: ${limitations || "None reported"}

CRITICAL REQUIREMENT
You MUST design a workout that trains ONLY the specified target muscle group(s): ${target}
Every exercise in the Main Workout section must directly target these muscles.
Do NOT include exercises for other body parts unless they are unavoidable in compound movements.

TASK
Design a safe, effective workout that:
- Focuses exclusively on ${target}
- Fits within ${length}
- Uses the available equipment: ${equipmentString}
- Avoids movements that could aggravate injuries
- Orders exercises logically (compound → isolation)

OUTPUT FORMAT
# Workout Plan for ${target}

## Warm-up
(Brief warm-up specific to ${target})

## Main Workout
### Exercise Name
- Description: brief coaching cues
- Sets x Reps
- Rest: X seconds
- **Video:** [Watch tutorial](YouTube search link)

## Cooldown

Keep it concise (6-8 exercises max) and focused on ${target}.
`.trim();

// const userPrompt = `
// You are a professional fitness trainer with extensive knowledge of human physiology, biomechanics, and injury prevention.

// CLIENT INFORMATION
// - Available equipment: ${equipmentString}
// - Target muscle group(s): ${target}
// - Workout duration: ${length}
// - Injuries or physical limitations: ${limitations || "None reported"}

// TASK
// Design a safe, effective, and well-structured workout that:
// - Prioritizes the specified target muscle group(s)
// - Fits realistically within the given workout duration
// - Uses primarily the available equipment
// - Avoids exercises that could aggravate any listed injuries or limitations
// - Substitutes risky movements with safer biomechanically sound alternatives when necessary

// PROGRAMMING GUIDELINES
// - Select appropriate exercises based on biomechanics and joint safety
// - Order exercises logically (compound → accessory → isolation when appropriate)
// - Include clear sets, reps, and rest periods
// - Adjust volume and intensity to match the workout duration
// - Do NOT include unnecessary exercises or equipment

// OUTPUT FORMAT
// Use the following structure:
// # Workout Plan
// ## Warm-up
// ## Main Workout
// ### Exercise Name
// - Description: brief coaching cues
// - Sets x Reps
// - Rest
// - **Video:** [Watch tutorial](YouTube search link)
// ## Cooldown
// ## Notes (optional: safety tips or progression advice)

// Keep the workout concise, professional, and easy to follow.
// `.trim();


    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    res.json({ text: msg.content?.[0]?.text ?? "" });
  } catch (err) {
    console.error("❌ AI request failed:", err);
    res.status(500).json({
      error: "AI request failed",
      details: err?.message || String(err),
    });
  }
});

export default app;



// import express from "express";
// import cors from "cors";
// import Anthropic from "@anthropic-ai/sdk";
// import dotenv from "dotenv";


// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(express.json());

// const SYSTEM_PROMPT = `
// You are a personal trainer. The user gives you a list of gym machines/equipment they have access to. Suggest a workout using some or all of that equipment (don’t force all items).

// For each exercise:
// - Include a short description, and explanation how to do the exercise. (1–3 sentences)
// - Include sets x reps and rest time
// - Include ONE video help link that ALWAYS works

// IMPORTANT (video links):
// - Do NOT provide direct YouTube watch links (youtube.com/watch...), because they can be wrong.
// - Instead provide a YouTube SEARCH results link, which always works:
//   https://www.youtube.com/results?search_query=<QUERY>
// - The link must be rendered as a clean Markdown link, so the user never sees "search_query".
//   Format EXACTLY like:
//   **Video:** [Watch tutorial](https://www.youtube.com/results?search_query=...)
// - The QUERY must be URL-friendly (spaces replaced with +).
// - The QUERY must include: exercise name + "tutorial" + one trusted channel name when possible.
//   Use one of these channel names in the query:
//   Jeff Nippard, Athlean-X, Renaissance Periodization, ScottHermanFitness, Jeremy Ethier, Calisthenicmovement

// Keep the workout concise (e.g., 6–10 exercises max) and do not add many extra equipment items.

// Format the full response in Markdown with clear headings and bullet points.
// `;

// const anthropic = new Anthropic({
//   apiKey: process.env.ANTHROPIC_API_KEY,
// });

// app.post("/api/training", async (req, res) => {
//   try {
//     const { equipmentArr, bodyPart, injury, duration } = req.body;

//     const equipmentString = Array.isArray(equipmentArr)
//       ? equipmentArr.join(", ")
//       : "";

//     const msg = await anthropic.messages.create({
//       model: "claude-3-haiku-20240307",
//       max_tokens: 1024,
//       system: SYSTEM_PROMPT,
//       messages: [
//         { role: "user", content: `I have access to: ${equipmentString}. Create a workout for me.` },
//       ],
//     });

//     res.json({ text: msg.content[0].text });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//     error: "AI request failed",
//     details: err?.message || String(err),
//   });
//   }
// });

// export default app;
