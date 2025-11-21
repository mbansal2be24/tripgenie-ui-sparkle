import { Request, Response } from "express";
import { tripGenieChat } from "../ai-service";
import { buildTripPlannerPrompt, buildShufflePrompt, buildChatPrompt } from "../ai/promptTemplates";
import { parseAIResponse } from "../utils/jsonParser";

export const generateTripPlan = async (req: Request, res: Response) => {
  try {
    const prompt = buildTripPlannerPrompt(req.body);
    const response = await tripGenieChat(prompt);
    
    let parsedData;
    try {
      parsedData = parseAIResponse(response);
      console.log("✅ Successfully parsed AI response");
    } catch (parseError: any) {
      console.error("❌ JSON parse error:", parseError.message);
      console.error("📄 Full AI response:", response);
      console.error("📄 Response length:", response.length);
      console.error("📄 First 500 chars:", response.substring(0, 500));
      
      return res.status(500).json({
        success: false,
        error: `AI returned invalid JSON format: ${parseError.message}. Please try again.`,
        debug: process.env.NODE_ENV === "development" ? {
          responsePreview: response.substring(0, 500),
          responseLength: response.length
        } : undefined
      });
    }
    
    // Validate the parsed data structure
    if (!parsedData.days || !Array.isArray(parsedData.days)) {
      console.error("❌ Invalid data structure - missing days array");
      return res.status(500).json({
        success: false,
        error: "AI response missing required 'days' array. Please try again."
      });
    }
    
    res.json({
      success: true,
      data: parsedData
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
    
    let parsedData;
    try {
      parsedData = parseAIResponse(response);
      console.log("✅ Successfully parsed shuffle response");
    } catch (parseError: any) {
      console.error("❌ JSON parse error:", parseError.message);
      console.error("📄 Full AI response:", response);
      return res.status(500).json({
        success: false,
        error: `AI returned invalid JSON format: ${parseError.message}. Please try again.`
      });
    }
    
    // Validate the parsed data structure
    if (!parsedData.new_place) {
      console.error("❌ Invalid data structure - missing new_place");
      return res.status(500).json({
        success: false,
        error: "AI response missing required 'new_place' field. Please try again."
      });
    }
    
    res.json({
      success: true,
      data: parsedData
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
