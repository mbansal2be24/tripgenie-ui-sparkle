export const buildTripPlannerPrompt = (request: any) => {
  const { userPreferences, location, duration, visited = [], previouslyShown = [] } = request;
  
  return `
Generate a ${duration}-day trip plan for ${location.city}.

USER PREFERENCES:
- Interests: ${userPreferences.interests.join(', ')}
- Budget: ${userPreferences.budget}
- Pace: ${userPreferences.pace}
- Food: ${userPreferences.foodPreference.join(', ')}
- Travel Style: ${userPreferences.travelStyle.join(', ')}

LOCATION DATA:
- City: ${location.city}
${location.geotag ? `- Coordinates: ${location.geotag.latitude}, ${location.geotag.longitude}` : ''}
${location.weather ? `- Weather: ${location.weather.temperature}°C, ${location.weather.condition}` : ''}

EXCLUSIONS:
- Already visited: ${visited.join(', ') || 'None'}
- Previously shown: ${previouslyShown.join(', ') || 'None'}

IMPORTANT: Provide REAL, SPECIFIC places that actually exist in ${location.city}. Do NOT use generic or fictional names.

Provide:
1. Day-wise itinerary with 3-5 REAL attractions per day (use actual place names that exist)
2. Timing recommendations based on weather
3. 4-7 REAL café/restaurant suggestions with actual names, vibes, price ranges, best dishes
4. 2-3 REAL nearby medical stores/pharmacies with actual names
5. Transport recommendations between places with realistic distances
6. Weather-appropriate tips and medicine kit suggestions

For each place, provide:
- Real, verifiable place names (not generic descriptions)
- Actual addresses or neighborhoods when possible
- Realistic ratings (4.0-5.0 range)
- Realistic review counts
- Actual distance estimates in km

CRITICAL JSON OUTPUT REQUIREMENTS:
1. Return ONLY valid JSON - absolutely no other text
2. Do NOT use markdown code blocks (no ```json```)
3. Do NOT add explanations before or after
4. Start with { and end with }
5. Ensure all strings use double quotes
6. Ensure proper comma placement
7. No trailing commas before } or ]

Return ONLY this JSON structure (start with {, end with }, nothing else):
{
  "days": [
    {
      "day": 1,
      "places": [
        {
          "name": "",
          "type": "",
          "description": "",
          "timing": "",
          "transport": "",
          "distance": ""
        }
      ]
    }
  ],
  "cafes": [],
  "medical": [],
  "tips": []
}

VERY IMPORTANT: 
- Your response must start with the character { and end with }
- Do not include any text, explanations, or markdown formatting
- Return ONLY the raw JSON object
- Example of correct output: {"days":[...],"cafes":[...]}
- Example of WRONG output: ```json\n{"days":...}\n``` or "Here is your plan: {...}"
`;
};

export const buildShufflePrompt = (request: any) => {
  const { placeName, placeType, location, userPreferences, visited = [], previouslyShown = [] } = request;
  
  return `
Replace this place: "${placeName}" (type: ${placeType})

REQUIREMENTS:
- Same category/type as original
- Located in ${location.city} or nearby
- Match user interests: ${userPreferences.interests.join(', ')}
- Different vibe but relevant
- NOT these places: ${[placeName, ...visited, ...previouslyShown].join(', ')}

${location.weather ? `Weather: ${location.weather.temperature}°C, ${location.weather.condition}` : ''}

CRITICAL: Return ONLY valid JSON. No explanations, no markdown, no code blocks, no extra text.

Return ONLY this JSON (nothing else):
{
  "new_place": "place name",
  "description": "1-2 line reason"
}
`;
};

export const buildChatPrompt = (message: string, context?: any) => {
  return `
User message: ${message}

${context ? `Context: ${JSON.stringify(context)}` : ''}

Respond as TripGenie PRO MAX with helpful travel advice.
`;
};
