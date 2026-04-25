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

    // 1. Updated Model to 1.5-flash and Version to v1beta
   const MODEL = "gemini-pro"; 
const API_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
const prompt = `Analyze this email for phishing. Return ONLY valid JSON.
      
      Format:
      {
        "isPhishing": true,
        "confidence": 85,
        "indicators": ["reason 1", "reason 2"],
        "recommendation": "short advice"
      }

      Email Content:
      ${emailText}
    `;

    // Replacement for the fetch part:
// 1. Use 'gemini-1.5-flash' with the 'v1' (stable) endpoint
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

const geminiRes = await fetch(API_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    contents: [{
      parts: [{ text: prompt }]
    }]
  })
});

const geminiData = await geminiRes.json();

// DEBUGGING LOG: This will show up in your Vercel Logs
console.log("Gemini Raw Response:", JSON.stringify(geminiData));

if (!geminiRes.ok) {
  return res.status(geminiRes.status).json({
    error: "Model connection failed",
    message: geminiData.error?.message || "Unknown error",
    suggestion: "Check if the API Key is restricted in Google Cloud Console"
  });
}

    const geminiData = await geminiRes.json();

    if (!geminiRes.ok) {
      return res.status(geminiRes.status).json({
        error: "Gemini API error",
        details: geminiData
      });
    }

    // 3. Extracting the text (Gemini 1.5 usually sends cleaner JSON)
    let aiText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Safely parse the JSON
    try {
      const parsed = JSON.parse(aiText);
      return res.status(200).json(parsed);
    } catch (parseError) {
      return res.status(500).json({
        error: "Failed to parse AI response",
        aiRawText: aiText
      });
    }

  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message
    });
  }
}