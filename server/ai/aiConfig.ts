import dotenv from "dotenv";

dotenv.config();

export const geminiConfig = {
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY as string,
  model: "gemini-2.0-flash-exp",
  maxTokens: 2048,
  temperature: 0.7
};

export const initializeGemini = () => {
  if (!geminiConfig.apiKey) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY not found in environment variables");
  }
  return geminiConfig;
};
