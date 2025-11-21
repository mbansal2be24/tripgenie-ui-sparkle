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

Provide:
1. Day-wise itinerary with 3-5 attractions per day
2. Timing recommendations based on weather
3. 4-7 café/restaurant suggestions with vibes, price, best dishes
4. 2-3 nearby medical stores
5. Transport recommendations between places
6. Weather-appropriate tips and medicine kit suggestions

Format as clean JSON with this structure:
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

Return ONLY this JSON format:
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
