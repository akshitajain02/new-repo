import OpenAI from "openai";

export default async function handler(req, res) {
  return res.status(200).json({
    isPhishing: true,
    confidence: 80,
    indicators: ["Test API working"],
    recommendation: "API working fine",
  });
}