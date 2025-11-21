import { Request, Response } from "express";
import { tripGenieChat } from "../ai/tripGenieChat";
import { buildTripPlannerPrompt, buildShufflePrompt, buildChatPrompt } from "../ai/promptTemplates";

export const generateTripPlan = async (req: Request, res: Response) => {
  try {
    const prompt = buildTripPlannerPrompt(req.body);
    const response = await tripGenieChat(prompt);
    
    res.json({
      success: true,
      data: JSON.parse(response)
    });
  } catch (error: any) {
    console.error("Trip plan generation error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate trip plan"
    });
  }
};

export const shufflePlace = async (req: Request, res: Response) => {
  try {
    const prompt = buildShufflePrompt(req.body);
    const response = await tripGenieChat(prompt);
    
    res.json({
      success: true,
      data: JSON.parse(response)
    });
  } catch (error: any) {
    console.error("Shuffle error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to shuffle place"
    });
  }
};

export const chatWithAI = async (req: Request, res: Response) => {
  try {
    const { message, context } = req.body;
    const prompt = buildChatPrompt(message, context);
    const response = await tripGenieChat(prompt);
    
    res.json({
      success: true,
      data: { message: response }
    });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to process chat"
    });
  }
};
