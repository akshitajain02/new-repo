export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { emailText } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: `
You are a cybersecurity phishing detection system.

Analyze the email strictly.

Rules:
- If email contains lottery, prize, money request, urgency, or asking for payment → mark as phishing
- If email asks for money transfer or bank details → phishing
- If urgency words like "urgent", "immediately" → increase risk

Return ONLY JSON:
{
  "isPhishing": true,
  "confidence": number (0-100),
  "indicators": ["clear reasons"],
  "recommendation": "short action advice"
}

IMPORTANT:
- Do NOT say safe for lottery scams
- Be strict and conservative
`
          },
          {
            role: "user",
            content: emailText
          }
        ]
      }),
    });

    const data = await response.json();

    const text = data?.choices?.[0]?.message?.content || "{}";

    const cleaned = text.replace(/```json|```/g, "").trim();

    const result = JSON.parse(cleaned);

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({
      error: "AI failed",
      details: error.message,
    });
  }
}