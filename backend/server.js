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
    content:
      "You are a phishing email detector. Classify aggressively for scam indicators such as lottery scams, advance-fee fraud, urgency, requests for money transfer, requests for passwords/bank details, threats, suspicious links, impersonation, and generic greetings. Reply ONLY with valid JSON. No markdown, no extra text."
  },
  {
    role: "user",
    content: `Analyze this email and return strict JSON in this exact shape:
{
  "isPhishing": true,
  "confidence": 0,
  "indicators": [],
  "recommendation": ""
}

Rules:
- If the email mentions lottery/prize/winnings AND asks for money/payment/fee/deposit first, it is phishing.
- If the email creates urgency to force payment, it is phishing.
- If the email asks for bank transfer or account payment, it is phishing.
- confidence must be a number from 0 to 100
- indicators must be an array of short strings
- recommendation must be one short paragraph

Email:
${email}`
  },
]
          
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
console.log("RAW AI RESPONSE:", result);
let parsed;

try {
  parsed = JSON.parse(result);
} catch (e) {
  console.log("RAW AI RESPONSE:", result);
  return res.json({
    isPhishing: true,
    confidence: 50,
    indicators: ["AI JSON parse failed"],
    recommendation: "Model response was not valid JSON.",
  });
}

return res.json({
  isPhishing: Boolean(parsed.isPhishing),
  confidence: Number(parsed.confidence ?? 50),
  indicators: Array.isArray(parsed.indicators)
    ? parsed.indicators
    : ["No indicators returned"],
  recommendation:
    typeof parsed.recommendation === "string" && parsed.recommendation.trim()
      ? parsed.recommendation
      : "Do not trust this email. Avoid sending money or sharing banking details.",
});

    res.json(JSON.parse(result));
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "AI failed" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));