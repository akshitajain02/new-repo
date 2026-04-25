export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  try {
    const { emailText } = req.body;
    if (!emailText) return res.status(400).json({ error: "Email text missing" });

    // MODEL UPDATED: Using 'gemini-pro' which is the most widely supported version for v1
    const MODEL = "gemini-pro"; 
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;

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
      // Agar 'gemini-pro' bhi 404 de, toh iska matlab model name nahi, API key issue hai
      return res.status(geminiRes.status).json({ 
        error: "API Error", 
        message: data.error?.message || "Model not found" 
      });
    }

    let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const cleanJson = aiText.replace(/```json/g, "").replace(/```/g, "").trim();

    return res.status(200).json(JSON.parse(cleanJson));

  } catch (error) {
    return res.status(500).json({ error: "System Error", message: error.message });
  }
}