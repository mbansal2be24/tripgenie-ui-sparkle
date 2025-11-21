import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

export const groqConfig = {
  apiKey: process.env.LLAMA_API_KEY as string,
  model: "llama-3.1-8b-instant",
  maxTokens: 2048,
  temperature: 0.7
};

export const initializeGroq = () => {
  if (!groqConfig.apiKey) {
    throw new Error("LLAMA_API_KEY not found in environment variables");
  }
  return new Groq({
    apiKey: groqConfig.apiKey,
  });
};
