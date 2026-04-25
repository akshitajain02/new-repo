export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { emailText } = req.body;
    if (!emailText) return res.status(400).json({ error: "Email text missing" });

    // 1. Correct URL for the most stable model
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const prompt = `Analyze this email for phishing. Return ONLY a JSON object. 
    Format: {"isPhishing": boolean, "confidence": number, "indicators": string[], "recommendation": string}
    Email: ${emailText}`;

    const geminiRes = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    // 2. Read the response as TEXT first to avoid the "Token A" crash
    const rawResponse = await geminiRes.text();
    
    let data;
    try {
      data = JSON.parse(rawResponse);
    } catch (e) {
      return res.status(500).json({ error: "Gemini sent non-JSON response", raw: rawResponse });
    }

    if (!geminiRes.ok) {
      return res.status(geminiRes.status).json({ error: "Gemini API Error", details: data });
    }

    // 3. Extract the text carefully
    const aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiResponseText) {
      return res.status(500).json({ error: "AI returned empty content" });
    }

    return res.status(200).json(JSON.parse(aiResponseText));

  } catch (error) {
    return res.status(500).json({ error: "Server crashed", message: error.message });
  }
}