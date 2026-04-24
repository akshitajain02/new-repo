import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { emailText } = req.body;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a phishing detector. Analyze the email and return JSON only like this:
{
  "isPhishing": true,
  "confidence": 85,
  "indicators": ["reason 1", "reason 2"],
  "recommendation": "what user should do"
}`,
        },
        {
          role: "user",
          content: emailText,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content);

    return res.status(200).json(result);
  } catch (error) {
    console.error("AI ERROR:", error);
    return res.status(500).json({
      error: "AI request failed",
      details: error.message,
    });
  }
}