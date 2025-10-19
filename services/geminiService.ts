import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parkingLotSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: 'A unique identifier for the parking lot.' },
    name: { type: Type.STRING, description: 'The name of the parking lot.' },
    address: { type: Type.STRING, description: 'The full street address of the parking lot.' },
    distance: { type: Type.STRING, description: 'Estimated walking or driving distance from the user\'s location (e.g., "5 min walk").' },
    availability: { type: Type.NUMBER, description: 'The predicted percentage of available spots (0-100).' },
    pricePerHour: { type: Type.NUMBER, description: 'The cost for one hour of parking.' },
    lat: { type: Type.NUMBER, description: 'The latitude coordinate of the parking lot.' },
    lng: { type: Type.NUMBER, description: 'The longitude coordinate of the parking lot.' },
  },
  required: ['id', 'name', 'address', 'distance', 'availability', 'pricePerHour', 'lat', 'lng'],
};

export async function fetchParkingPredictions(location: string | GeolocationCoordinates) {
  const locationPrompt = typeof location === 'string'
    ? `Find parking lots near ${location}.`
    : `Find parking lots near latitude ${location.latitude} and longitude ${location.longitude}.`;

  const prompt = `${locationPrompt} For each lot, provide its ID, name, full address, distance, predicted spot availability percentage, price per hour, and precise latitude/longitude coordinates.`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      // CRITICAL FIX: Add a system instruction to enforce a strict JSON-only response. This prevents the model
      // from adding conversational text or markdown, which was causing parsing errors and infinite loading.
      config: {
        systemInstruction: "You are a helpful assistant. Your only job is to return a valid, parsable JSON array of parking lots based on the user's query. Do not include any other text, conversation, or markdown formatting like ```json. The entire response must be only the JSON data, starting with `[` and ending with `]`.",
        tools: [{ googleMaps: {} }],
      },
    });

    // The response text from the model might be wrapped in markdown or have other text.
    // We need to robustly extract the JSON part.
    const text = response.text.trim();
    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']');

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No valid JSON array found in the AI's response.");
    }

    const jsonString = text.substring(jsonStart, jsonEnd + 1);
    
    return JSON.parse(jsonString);

  } catch (error) {
    console.error("Error fetching parking predictions from Gemini API:", error);
    if (error instanceof Error && error.message.includes("400")) {
         throw new Error(`There was a configuration error with the AI service. Please try again later.`);
    }
    throw new Error("Failed to communicate with the AI service. Please check your connection and try again.");
  }
}
