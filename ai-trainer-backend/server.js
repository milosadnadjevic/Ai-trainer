import dotenv from "dotenv";
dotenv.config();
console.log("KEY?", process.env.ANTHROPIC_API_KEY?.slice(0, 10));


import app from "./app.js";

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
