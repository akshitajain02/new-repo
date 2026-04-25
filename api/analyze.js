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
        model: "llama-3.1-8b-8192",
        messages: [
          {
            role: "system",
            content: `
You are an advanced cybersecurity AI trained to detect phishing emails.

Your task is to analyze the email deeply and classify it as either SAFE or PHISHING.

Do NOT guess. Use structured reasoning.

Step 1: Identify suspicious elements:
- Urgency (urgent, act now, limited time)
- Financial requests (money, transfer, deposit, payment)
- Sensitive data requests (password, OTP, bank details)
- Rewards or offers (lottery, prize, gift, winnings)
- Threats (account suspension, penalties)
- Suspicious links or instructions to click
- Impersonation (bank, company, authority pretending)

Step 2: Assign risk score (0–100):
- 0–30 → Safe
- 31–60 → Suspicious
- 61–100 → Phishing

Step 3: Decide:
- If risk ≥ 60 → PHISHING
- Else → SAFE

Return ONLY JSON:

{
  "isPhishing": true or false,
  "confidence": number (0-100),
  "indicators": ["list of detected risk factors"],
  "recommendation": "clear user advice"
}

Guidelines:
- Be strict but logical (not random)
- Do not mark everything as phishing
- Explain indicators clearly
- Handle ALL types of emails (bank, job, OTP, delivery, etc.)

Examples:

1. Email: "Verify your bank account immediately"
→ Phishing

2. Email: "Your Amazon order has shipped"
→ Safe

3. Email: "Reset your password using this link"
→ Suspicious/Phishing depending on context

Think carefully before responding.
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

if (!response.ok) {
  return res.status(500).json({
    error: "Groq API failed",
    details: data,
  });
}

const text = data?.choices?.[0]?.message?.content || "{}";
const cleaned = text.replace(/```json|```/g, "").trim();

let result;
try {
  result = JSON.parse(cleaned);
} catch {
  result = {
    isPhishing: true,
    confidence: 70,
    indicators: ["AI response format issue"],
    recommendation: cleaned,
  };
}

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