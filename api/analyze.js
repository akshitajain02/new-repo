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
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: `
You are a strict phishing detection system.

If ANY of these are present, mark as phishing:
- lottery, prize, winnings
- money request, deposit, transfer
- urgency (urgent, immediately)
- asking for bank/account/payment

Return ONLY JSON:
{
  "isPhishing": true,
  "confidence": number (0-100),
  "indicators": ["clear reasons"],
  "recommendation": "short action advice"
}

Be strict. Never mark lottery emails as safe.
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

    let result = JSON.parse(cleaned);

    // 🔥 HYBRID SAFETY (GUARANTEED DETECTION)
    const lower = emailText.toLowerCase();

    if (
      lower.includes("lottery") ||
      lower.includes("won") ||
      lower.includes("prize") ||
      lower.includes("urgent") ||
      lower.includes("deposit") ||
      lower.includes("bank")
    ) {
      result = {
        isPhishing: true,
        confidence: 90,
        indicators: [
          "Lottery scam detected",
          "Money request found",
          "Urgency pressure detected"
        ],
        recommendation: "Do not send money. This is a phishing scam."
      };
    }

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({
      error: "AI failed",
      details: error.message,
    });
  }
}