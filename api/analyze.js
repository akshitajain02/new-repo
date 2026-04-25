export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { emailText } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze this email and detect if it is phishing.
Return ONLY JSON in this format:
{
  "isPhishing": true,
  "confidence": 85,
  "indicators": ["reason1", "reason2"],
  "recommendation": "what to do"
}

Email:
${emailText}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("GEMINI RAW:", data);

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    const result = JSON.parse(text);

    return res.status(200).json(result);
  } catch (error) {
    console.error("GEMINI ERROR:", error);

    return res.status(500).json({
      error: "Gemini request failed",
      details: error.message,
    });
  }
}