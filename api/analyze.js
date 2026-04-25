export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { emailText } = req.body;

    if (!emailText) {
      return res.status(400).json({ error: "Email text missing" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY missing in Vercel" });
    }

    const prompt = `
Analyze this email for phishing. Return ONLY valid JSON, no markdown.

Format:
{
  "isPhishing": true,
  "confidence": 85,
  "indicators": ["reason 1", "reason 2"],
  "recommendation": "short advice"
}

Email:
${emailText}
`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const geminiData = await geminiRes.json();

    if (!geminiRes.ok) {
      return res.status(500).json({
        error: "Gemini API error",
        details: geminiData
      });
    }

    let aiText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    aiText = aiText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(aiText);

    return res.status(200).json(parsed);
  } catch (error) {
    return res.status(500).json({
      error: "Gemini request failed",
      details: error.message
    });
  }
}