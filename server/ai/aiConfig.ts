import LlamaAPI from "@llamaapi/llamaapi";
import dotenv from "dotenv";

dotenv.config();

export const llamaConfig = {
  apiKey: process.env.LLAMA_API_KEY as string,
  model: "llama3.1-8b",
  maxTokens: 2048,
  temperature: 0.7
};

export const initializeLlama = () => {
  if (!llamaConfig.apiKey) {
    throw new Error("LLAMA_API_KEY not found in environment variables");
  }
  return new LlamaAPI(llamaConfig.apiKey);
};
