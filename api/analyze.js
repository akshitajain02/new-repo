export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { emailText } = req.body;

    if (!emailText || !emailText.trim()) {
      return res.status(400).json({ error: "Email text is required" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.1,
        messages: [
          {
            role: "system",
            content: `
You are an expert cybersecurity phishing email detection engine.

Analyze ANY type of email: banking, job offer, delivery, lottery, OTP, password reset, account suspension, invoice, school/college notice, company notice, shopping, social media, crypto, government, tax, payment, refund, investment, charity, and normal personal emails.

Classify the email as PHISHING or SAFE using strict cybersecurity logic.

High-risk phishing indicators include:
- Lottery, prize, reward, winnings, gift card, free money
- Asking for payment, deposit, transfer, processing fee, advance fee
- Asking for OTP, password, PIN, bank details, card details, login credentials
- Urgency or pressure: urgent, immediately, act now, limited time, last warning
- Threats: account suspension, legal action, penalty, blocked account
- Suspicious links, shortened links, unknown domains, click instructions
- Impersonation of bank, company, government, college, delivery service, support team
- Poor grammar combined with financial/sensitive request
- Too-good-to-be-true offer
- Crypto, investment, inheritance, donation, refund scam

Decision rules:
- If there is any request for money or sensitive information with urgency, mark PHISHING.
- If there is lottery/prize/winnings with payment or claim instruction, mark PHISHING.
- If email contains suspicious link + account/security warning, mark PHISHING.
- If email is normal informational communication without sensitive request, mark SAFE.
- Be conservative. If risk is unclear but suspicious, mark PHISHING.

Recommendation rules:
- If money is asked → clearly say DO NOT SEND MONEY
- If OTP/password → say DO NOT SHARE CREDENTIALS
- If link present → say DO NOT CLICK LINKS
- Make recommendation specific to this email, not generic
Return ONLY valid JSON. No markdown. No extra text.

Required JSON format:
{
  "isPhishing": true,
  "confidence": 0,
  "indicators": [
    "Detailed reason 1",
    "Detailed reason 2",
    "Detailed reason 3"
  ],
"recommendation": "Give a SPECIFIC recommendation based on the email content. Do not repeat generic advice. Mention exact action user should take for THIS email.",
  "summary": "Short 1-2 sentence explanation of why this email is safe or phishing."
}

Confidence guide:
0-30 = mostly safe
31-60 = suspicious
61-100 = phishing/high risk

Make indicators specific and detailed, not one-word.
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
    } catch (parseError) {
      result = {
        isPhishing: true,
        confidence: 70,
        indicators: [
          "AI response could not be parsed correctly, so the system treated the email as suspicious for safety."
        ],
        recommendation:
          "Do not click links or share personal information until the sender and email content are verified.",
        summary: cleaned || "AI returned an unclear response.",
      };
    }

    // Hybrid rule-based safety layer
    const lower = emailText.toLowerCase();
    const ruleIndicators = [];
    let ruleScore = 0;

    if (/(lottery|prize|reward|won|winner|winnings|gift card)/i.test(lower)) {
      ruleScore += 30;
      ruleIndicators.push("The email contains reward/lottery language, which is commonly used in phishing scams.");
    }

    if (/(deposit|payment|transfer|processing fee|advance fee|send money|pay|rs\.?|₹|\$)/i.test(lower)) {
      ruleScore += 30;
      ruleIndicators.push("The email asks for money, payment, deposit, or financial action.");
    }

    if (/(urgent|immediately|act now|limited time|last warning|as soon as possible)/i.test(lower)) {
      ruleScore += 20;
      ruleIndicators.push("The email uses urgency or pressure tactics to force quick action.");
    }

    if (/(password|otp|pin|bank account|credit card|debit card|login|verify account|account number)/i.test(lower)) {
      ruleScore += 30;
      ruleIndicators.push("The email refers to sensitive credentials, banking information, or account verification.");
    }

    if (/(click here|http:\/\/|https:\/\/|www\.|link)/i.test(lower)) {
      ruleScore += 20;
      ruleIndicators.push("The email contains a link or asks the user to click, which can redirect to a malicious website.");
    }

    if (/(suspend|blocked|locked|penalty|legal action|unauthorized|security alert)/i.test(lower)) {
      ruleScore += 25;
      ruleIndicators.push("The email uses threat-based language such as account suspension or security warning.");
    }

    if (ruleScore >= 40) {
      result.isPhishing = true;
      result.confidence = Math.max(Number(result.confidence || 0), Math.min(98, 5 + ruleScore));
      result.indicators = [
        ...new Set([
          ...(Array.isArray(result.indicators) ? result.indicators : []),
          ...ruleIndicators,
        ]),
      ];
      result.recommendation =
        "Do not click any links, do not send money, and do not share OTP, password, banking, or personal details. Verify the sender through an official website, phone number, or trusted channel before taking any action.";
      result.summary =
        "This email shows multiple phishing characteristics such as financial pressure, urgency, suspicious claims, or sensitive information requests.";
    }

    return res.status(200).json({
      isPhishing: Boolean(result.isPhishing),
      confidence: Number(result.confidence ?? 50),
      indicators: Array.isArray(result.indicators) && result.indicators.length
        ? result.indicators
        : ["No major suspicious indicators were detected."],
      recommendation: result.recommendation || "Verify the sender before responding.",
      summary: result.summary || "",
    });

  } catch (error) {
    return res.status(500).json({
      error: "AI failed",
      details: error.message,
    });
  }
}