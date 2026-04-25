export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { emailText } = req.body;
    if (!emailText) {
      return res.status(400).json({ error: "Email text missing" });
    }

    // STABLE CONFIG: Using v1 (stable) with gemini-1.5-flash
    const MODEL = "gemini-1.5-flash";
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const prompt = `Analyze this email for phishing. Return ONLY valid JSON.
    Format: {"isPhishing": boolean, "confidence": number, "indicators": string[], "recommendation": string}
    Email: ${emailText}`;

    const geminiRes = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await geminiRes.json();

    // If Gemini still says 404, we catch it here before it crashes the frontend
    if (!geminiRes.ok) {
      return res.status(geminiRes.status).json({ 
        error: "Gemini Model Error", 
        details: data.error?.message || "Model not found" 
      });
    }

    let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // CLEANING: Removes markdown like ```json ... ```
    const cleanJson = aiText.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const parsed = JSON.parse(cleanJson);
      return res.status(200).json(parsed);
    } catch (parseError) {
      return res.status(500).json({ error: "AI response was not valid JSON", raw: aiText });
    }

  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
}