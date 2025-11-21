import OpenAI from "openai";
import type { Trip } from "@shared/schema";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateItinerary(trip: Trip) {
  try {
    const prompt = `Generate a ${trip.days}-day travel itinerary for ${trip.destination} for ${trip.travelStyle} travelers with a budget of ₹${trip.budget} (INR).
Interests: ${trip.interests.join(", ")}

Return JSON with this structure (no markdown, just JSON):
{
  "attractions": [
    {"name": "...", "description": "...", "timing": "Morning|Afternoon|Evening", "rating": 4.5, "reviews": 1000, "category": "..."}
  ],
  "restaurants": [
    {"name": "...", "rating": 4.5, "reviews": 500, "price": 2500, "cuisine": "...", "day": 1, "mealType": "Lunch|Breakfast|Dinner"}
  ],
  "nearbyPlaces": [
    {"name": "...", "category": "attractions|food|cafes|nightlife", "rating": 4.5, "reviews": 500, "priceLevel": "₹₹", "distance": "1.5 km"}
  ],
  "indoorAlternatives": [
    {"name": "...", "description": "...", "rating": 4.5}
  ]
}

Note: All prices should be in Indian Rupees (INR). Restaurant prices should be per person in INR.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No response from OpenAI");

    // Parse the JSON response
    const itineraryData = JSON.parse(content);
    return itineraryData;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw error;
  }
}
