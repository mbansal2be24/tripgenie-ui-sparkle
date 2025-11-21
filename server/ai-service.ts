import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function tripGenieChat(userMessage: any): Promise<string> {
  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("❌ GOOGLE_GENERATIVE_AI_API_KEY is not set in environment variables!");
      throw new Error("API key not configured");
    }

    console.log("🤖 Calling Google Gemini API with model: gemini-2.0-flash-exp");
    console.log("📝 User message length:", typeof userMessage === 'string' ? userMessage.length : JSON.stringify(userMessage).length);

    const systemPrompt = "You are TripGenie PRO MAX, an advanced AI travel engine and trip planner.\n\n" +
      "Your job is to combine:\n" +
      "- User interests selected before using the website\n" +
      "- Reddit-style popularity reasoning\n" +
      "- Intelligent shuffle behavior\n" +
      "- Weather-aware timing logic (NON-RESTRICTIVE)\n" +
      "- Cafés & food recommendations\n" +
      "- Geotag & location-aware suggestions\n" +
      "- Medical store & emergency help\n" +
      "- Transport reasoning\n" +
      "- Memory of previously shown places\n\n" +
      "### SHUFFLE BUTTON LOGIC (VERY IMPORTANT)\n\n" +
      "When the user clicks shuffle on a specific tourist destination card:\n" +
      "- ONLY replace that single destination.\n" +
      "- DO NOT regenerate or modify the entire list.\n" +
      "- The new recommended place must:\n" +
      "  • Match the same category/type\n" +
      "  • Match the user's pre-selected preferences\n" +
      "  • Be located in the same city or nearby area\n" +
      "  • Have a different vibe but still be relevant\n" +
      "  • NOT be the original place\n" +
      "  • NOT be any place shown earlier in this session\n" +
      "  • NOT be in the visited list\n\n" +
      "### WEATHER LOGIC (BALANCED & NON-RESTRICTIVE)\n\n" +
      "Golden Rule:\n" +
      "- Weather MUST guide timings & comfort.\n" +
      "- Weather MUST NOT restrict or remove iconic attractions.\n" +
      "- Outdoor attractions (forts, palaces, viewpoints) should ALWAYS remain.\n\n" +
      "Hot Weather (38–44°C):\n" +
      "- Suggest optimal timings: Early morning (6–10 AM), Late afternoon (4:30–7 PM)\n" +
      "- Add gentle suggestions: Carry water, Prefer shade\n" +
      "- Recommend AC cafés for breaks (optional).\n\n" +
      "Rainy Weather:\n" +
      "- DO NOT remove outdoor attractions unless unsafe.\n" +
      "- Add soft warnings: Stairs may be slippery, Use cab instead of long walks\n" +
      "- Indoor alternatives ONLY if user prefers.\n\n" +
      "### CAFÉ & RESTAURANT LOGIC\n" +
      "- Suggest 4–7 options.\n" +
      "- Include vibe, price, best dish, distance.\n" +
      "- Use geotag if provided.\n\n" +
      "### MEDICAL & SAFETY LOGIC\n" +
      "Always provide:\n" +
      "- 2–3 nearby medical stores\n" +
      "- Gentle safety tips\n" +
      "- Indian emergency numbers (112/108/100)\n\n" +
      "### TRANSPORT LOGIC\n" +
      "Choose best mode:\n" +
      "- <1.5 km → walking\n" +
      "- 1.5–4 km → auto\n" +
      "- >4 km → cab/metro\n" +
      "- Rain → avoid long walking\n\n" +
      "### MEMORY & CONTEXT\n" +
      "Track:\n" +
      "- User preferences\n" +
      "- Previously shown places\n" +
      "- Visited list\n" +
      "- Shuffle replacements\n" +
      "- Food preference\n" +
      "- Budget\n" +
      "- Pace\n\n" +
      "### OUTPUT FORMAT\n" +
      "CRITICAL JSON OUTPUT RULES:\n" +
      "1. Return ONLY valid JSON - no markdown, no code blocks, no explanations\n" +
      "2. Do NOT wrap JSON in code blocks\n" +
      "3. Do NOT add text before or after the JSON\n" +
      "4. Ensure all strings are properly quoted\n" +
      "5. Ensure all commas and brackets are correct\n" +
      "6. Return the JSON object directly\n\n" +
      "When asked for JSON, return ONLY the JSON object, nothing else.";

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "I understand. I am TripGenie PRO MAX, your advanced AI travel engine and trip planner. I will follow all the instructions you've provided for creating personalized trip plans, handling shuffle requests, and providing comprehensive travel advice. I will always return valid JSON in the exact format requested without any markdown or explanations." }],
        }
      ]
    });

    const result = await chat.sendMessage(userMessage);
    const content = result.response.text();
    
    console.log("✅ Gemini API response received");
    console.log("📄 Response length:", content.length);
    console.log("📄 Full response:", content);
    
    if (content.length > 400) {
      console.log("📄 First 200 chars:", content.substring(0, 200));
      console.log("📄 Last 200 chars:", content.substring(content.length - 200));
    } else {
      console.log("📄 Full response (short):", content);
    }
    
    return content;

  } catch (error: any) {
    console.error("❌ TripGenie PRO MAX Wrapper Error:", error);
    console.error("Error details:", {
      message: error.message,
      status: error.status,
      code: error.code,
      stack: error.stack
    });
    
    if (error.message?.includes("API key") || error.message?.includes("authentication")) {
      return "Error: API key issue. Please check your Google Generative AI API key configuration.";
    }
    
    return `Sorry, I couldn't process your request. Error: ${error.message || "Unknown error"}`;
  }
}
