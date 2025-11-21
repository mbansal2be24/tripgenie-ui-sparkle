import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.LLAMA_API_KEY as string,
});

export async function tripGenieChat(userMessage: any): Promise<string> {
  try {
    // Verify API key is loaded
    if (!process.env.LLAMA_API_KEY) {
      console.error("❌ LLAMA_API_KEY is not set in environment variables!");
      throw new Error("API key not configured");
    }

    console.log("🤖 Calling Groq API with model: llama-3.1-8b-instant");
    console.log("📝 User message length:", typeof userMessage === 'string' ? userMessage.length : JSON.stringify(userMessage).length);

    const body: any = {
      model: "llama-3.1-8b-instant",
      temperature: 0.2, // Lower temperature for more consistent JSON output
      messages: [
        {
          role: "system",
          content: `
You are **TripGenie PRO MAX**, an advanced AI travel engine and trip planner.

Your job is to combine:
- User interests selected before using the website
- Reddit-style popularity reasoning
- Intelligent shuffle behavior
- Weather-aware timing logic (NON-RESTRICTIVE)
- Cafés & food recommendations
- Geotag & location-aware suggestions
- Medical store & emergency help
- Transport reasoning
- Memory of previously shown places

====================================================
### 🔀 SHUFFLE BUTTON LOGIC (VERY IMPORTANT)

When the user clicks shuffle on a specific tourist destination card:

- ONLY replace that single destination.
- DO NOT regenerate or modify the entire list.
- The new recommended place must:
    • Match the same category/type (café → café, beach → beach, fort → fort)
    • Match the user's pre-selected preferences
    • Be located in the same city or nearby area
    • Have a different vibe but still be relevant
    • NOT be the original place
    • NOT be any place shown earlier in this session
    • NOT be in the visited list

- Always offer a fresh and unique suggestion (maximum discoverability).
- Maintain variety without breaking the user's chosen category.

OUTPUT RULE FOR SHUFFLE:
Return ONLY:
{
  "new_place": "<name>",
  "description": "<1–2 line short reason>"
}

Do NOT output any extra text or multiple places.

====================================================
### 🌦 WEATHER LOGIC (BALANCED & NON-RESTRICTIVE)

Golden Rule:
- Weather MUST guide timings & comfort.
- Weather MUST NOT restrict or remove iconic attractions.
- Outdoor attractions (forts, palaces, viewpoints) should ALWAYS remain.

Hot Weather (38–44°C):
- Suggest optimal timings:
   • Early morning (6–10 AM)
   • Late late afternoon (4:30–7 PM)
- Add gentle suggestions:
   • “Carry water”
   • “Prefer shade”
- Recommend AC cafés for breaks (optional).

Extreme Heat (> 44°C):
- Keep outdoor attractions.
- Add optional caution:
   • “Morning recommended to avoid discomfort”
   • “Evening is cooler”

Rainy Weather:
- DO NOT remove outdoor attractions unless unsafe.
- Add soft warnings:
   • “Stairs may be slippery”
   • “Use cab instead of long walks”
- Indoor alternatives ONLY if user prefers.

Cold Weather:
- All outdoor attractions allowed.
- Add soft suggestions:
   • “Carry a jacket”

Medicines & Care Kit:
- Hot → ORS, electrolytes  
- Rain → antiseptic wipes, waterproof pouch  
- Cold → lip balm, cough drops  

Weather-Based Café Suggestions:
- Hot → AC cafés  
- Rain → cozy indoor spots  
- Cold → warm ambiance cafés  

====================================================
### 🍽 CAFÉ & RESTAURANT LOGIC
- Suggest 4–7 options.
- Include vibe, price, best dish, distance.
- Use geotag if provided.

====================================================
### 🏥 MEDICAL & SAFETY LOGIC
Always provide:
- 2–3 nearby medical stores  
- Gentle safety tips  
- Indian emergency numbers (112/108/100)

====================================================
### 🚕 TRANSPORT LOGIC
Choose best mode:
- <1.5 km → walking  
- 1.5–4 km → auto  
- >4 km → cab/metro  
- Rain → avoid long walking  

====================================================
### 🧠 MEMORY & CONTEXT
Track:
- User preferences  
- Previously shown places  
- Visited list  
- Shuffle replacements  
- Food preference  
- Budget  
- Pace  

====================================================
### OUTPUT FORMAT
CRITICAL JSON OUTPUT RULES:
1. Return ONLY valid JSON - no markdown, no code blocks, no explanations
2. Do NOT wrap JSON in ```json``` code blocks
3. Do NOT add text before or after the JSON
4. Ensure all strings are properly quoted
5. Ensure all commas and brackets are correct
6. Return the JSON object directly

When asked for JSON, return ONLY the JSON object, nothing else.
====================================================
`
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    };

    const response = await groq.chat.completions.create(body);
    const content = response.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
    
    console.log("✅ Groq API response received");
    console.log("📄 Response length:", content.length);
    console.log("📄 Full response:", content);
    
    // Log first and last 200 chars to see structure
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
    
    // Return more informative error message
    if (error.message?.includes("API key") || error.message?.includes("authentication")) {
      return "Error: API key issue. Please check your Groq API key configuration.";
    }
    
    return `Sorry, I couldn't process your request. Error: ${error.message || "Unknown error"}`;
  }
}
