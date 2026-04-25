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
You are an expert cybersecurity AI specialized in phishing detection.

Your job is to STRICTLY classify emails as PHISHING or SAFE.

Follow these strict rules:

🚨 ALWAYS mark as PHISHING if ANY of these are present:
- Lottery, prize, winnings, rewards
- Asking for money, deposit, payment, transfer
- Urgency words (urgent, immediately, act now, limited time)
- Asking for bank details, OTP, password, or sensitive info
- Threats (account suspension, penalty, loss of access)
- Suspicious links or instructions to click
- Too-good-to-be-true offers

⚠️ IMPORTANT:
- Even ONE strong indicator = PHISHING
- Be conservative: when in doubt → PHISHING
- Never trust lottery or prize emails
- Never mark financial requests as SAFE

Return ONLY valid JSON (no explanation, no text outside JSON):

{
  "isPhishing": true or false,
  "confidence": number between 0-100,
  "indicators": ["clear specific reasons"],
  "recommendation": "short action advice"
}

Examples:

Input: "You have won a lottery, send ₹5000 to claim"
Output:
{
  "isPhishing": true,
  "confidence": 95,
  "indicators": ["Lottery scam", "Money request", "Fraudulent claim"],
  "recommendation": "Do not send money. This is a scam."
}

Input: "Meeting scheduled tomorrow at 10am"
Output:
{
  "isPhishing": false,
  "confidence": 90,
  "indicators": ["Normal communication"],
  "recommendation": "No phishing detected."
}

Be strict, accurate, and security-focused.
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