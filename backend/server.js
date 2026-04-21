import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/analyze", async (req, res) => {
  try {
    const { email } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a phishing detection AI. Reply in JSON only.",
        },
        {
          role: "user",
          content: `Analyze this email:\n\n${email}
          
Return JSON:
{
"isPhishing": boolean,
"confidence": number (0-100),
"indicators": string[],
"recommendation": string
}`,
        },
      ],
    });

    const result = response.choices[0].message.content;

    res.json(JSON.parse(result));
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "AI failed" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));