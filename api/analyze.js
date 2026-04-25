export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  try {
    const { emailText } = req.body;
    if (!emailText) return res.status(400).json({ error: "Email text missing" });

    // FIX: Using v1beta BUT without the fancy generationConfig that caused the 400 error.
    // This is the most compatible way to reach 1.5-flash.
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const prompt = `Analyze this email for phishing. Return ONLY a valid JSON object. 
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

    if (!geminiRes.ok) {
      return res.status(geminiRes.status).json({ error: "API Connection Issue", details: data });
    }

    let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Cleaning the response just in case it adds ```json
    aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();

    return res.status(200).json(JSON.parse(aiText));

  } catch (error) {
    return res.status(500).json({ error: "System Error", message: error.message });
  }
}