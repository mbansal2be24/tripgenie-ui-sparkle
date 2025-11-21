export const buildTripPlannerPrompt = (request: any) => {
  const { userPreferences, location, duration, visited = [], previouslyShown = [] } = request;
  
  const weatherInfo = location.weather ? `- Weather: ${location.weather.temperature}°C, ${location.weather.condition}` : '';
  const geotagInfo = location.geotag ? `- Coordinates: ${location.geotag.latitude}, ${location.geotag.longitude}` : '';
  
  return "Generate a " + duration + "-day trip plan for " + location.city + ".\n\n" +
    "USER PREFERENCES:\n" +
    "- Interests: " + userPreferences.interests.join(', ') + "\n" +
    "- Budget: " + userPreferences.budget + "\n" +
    "- Pace: " + userPreferences.pace + "\n" +
    "- Food: " + userPreferences.foodPreference.join(', ') + "\n" +
    "- Travel Style: " + userPreferences.travelStyle.join(', ') + "\n\n" +
    "LOCATION DATA:\n" +
    "- City: " + location.city + "\n" +
    geotagInfo + (geotagInfo ? "\n" : "") +
    weatherInfo + (weatherInfo ? "\n" : "") + "\n" +
    "EXCLUSIONS:\n" +
    "- Already visited: " + (visited.join(', ') || 'None') + "\n" +
    "- Previously shown: " + (previouslyShown.join(', ') || 'None') + "\n\n" +
    "IMPORTANT: Provide REAL, SPECIFIC places that actually exist in " + location.city + ". Do NOT use generic or fictional names.\n\n" +
    "Provide:\n" +
    "1. Day-wise itinerary with 3-5 REAL attractions per day (use actual place names that exist)\n" +
    "2. Timing recommendations based on weather\n" +
    "3. 4-7 REAL café/restaurant suggestions with actual names, vibes, price ranges, best dishes\n" +
    "4. 2-3 REAL nearby medical stores/pharmacies with actual names\n" +
    "5. Transport recommendations between places with realistic distances\n" +
    "6. Weather-appropriate tips and medicine kit suggestions\n\n" +
    "For each place, provide:\n" +
    "- Real, verifiable place names (not generic descriptions)\n" +
    "- Actual addresses or neighborhoods when possible\n" +
    "- Realistic ratings (4.0-5.0 range)\n" +
    "- Realistic review counts\n" +
    "- Actual distance estimates in km\n\n" +
    "CRITICAL JSON OUTPUT REQUIREMENTS:\n" +
    "1. Return ONLY valid JSON - absolutely no other text\n" +
    "2. Do NOT use markdown code blocks\n" +
    "3. Do NOT add explanations before or after\n" +
    "4. Start with { and end with }\n" +
    "5. Ensure all strings use double quotes\n" +
    "6. Ensure proper comma placement\n" +
    "7. No trailing commas before } or ]\n\n" +
    "Return ONLY this JSON structure (start with {, end with }, nothing else):\n" +
    '{\n  "days": [\n    {\n      "day": 1,\n      "places": [\n        {\n          "name": "",\n          "type": "",\n          "description": "",\n          "timing": "",\n          "transport": "",\n          "distance": ""\n        }\n      ]\n    }\n  ],\n  "cafes": [],\n  "medical": [],\n  "tips": []\n}\n\n' +
    "VERY IMPORTANT:\n" +
    "- Your response must start with the character { and end with }\n" +
    "- Do not include any text, explanations, or markdown formatting\n" +
    "- Return ONLY the raw JSON object";
};

export const buildShufflePrompt = (request: any) => {
  const { placeName, placeType, location, userPreferences, visited = [], previouslyShown = [] } = request;
  
  const weatherInfo = location.weather ? `Weather: ${location.weather.temperature}°C, ${location.weather.condition}` : '';
  
  return 'Replace this place: "' + placeName + '" (type: ' + placeType + ')\n\n' +
    "REQUIREMENTS:\n" +
    "- Same category/type as original\n" +
    "- Located in " + location.city + " or nearby\n" +
    "- Match user interests: " + userPreferences.interests.join(', ') + "\n" +
    "- Different vibe but relevant\n" +
    "- NOT these places: " + [placeName, ...visited, ...previouslyShown].join(', ') + "\n\n" +
    weatherInfo + (weatherInfo ? "\n\n" : "") +
    "CRITICAL: Return ONLY valid JSON. No explanations, no markdown, no code blocks, no extra text.\n\n" +
    "Return ONLY this JSON (nothing else):\n" +
    '{\n  "new_place": "place name",\n  "description": "1-2 line reason"\n}';
};

export const buildChatPrompt = (message: string, context?: any) => {
  return "User message: " + message + "\n\n" +
    (context ? "Context: " + JSON.stringify(context) + "\n\n" : "") +
    "Respond as TripGenie PRO MAX with helpful travel advice.";
};
