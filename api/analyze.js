export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { emailText } = req.body;
    if (!emailText) return res.status(400).json({ error: "Email text missing" });

    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    // Prompt ko aur strong banaya hai taaki JSON hi mile
    const prompt = `Analyze this email for phishing. Return ONLY a valid raw JSON object. Do not include markdown formatting like \`\`\`json.
    
    JSON Format:
    {"isPhishing": boolean, "confidence": number, "indicators": string[], "recommendation": string}

    Email Content:
    ${emailText}`;

    const geminiRes = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
        // Yahan se generationConfig wali line hata di hai jo error de rahi thi
      })
    });

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      return res.status(geminiRes.status).json({ error: "Gemini Error", details: data });
    }

    let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Clean any accidental markdown from the response
    aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const parsed = JSON.parse(aiText);
      return res.status(200).json(parsed);
    } catch (e) {
      return res.status(500).json({ error: "AI sent invalid JSON", raw: aiText });
    }

  } catch (error) {
    return res.status(500).json({ error: "Server crashed", message: error.message });
  }
}