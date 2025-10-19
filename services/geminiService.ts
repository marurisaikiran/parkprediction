import { GoogleGenAI, Type } from "@google/genai";
import type { ParkingLot } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parkingLotSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: 'A unique identifier for the parking lot.' },
    name: { type: Type.STRING, description: 'The name of the parking lot or garage.' },
    address: { type: Type.STRING, description: 'The full street address of the parking lot.' },
    distance: { type: Type.STRING, description: 'A string representing the distance from the target location, e.g., "0.2 miles away".' },
    availability: { type: Type.NUMBER, description: 'A number between 0 and 100 representing the percentage of available spots.' },
    pricePerHour: { type: Type.NUMBER, description: 'The hourly parking rate in USD.' },
    lat: { type: Type.NUMBER, description: 'The latitude coordinate of the parking lot.'},
    lng: { type: Type.NUMBER, description: 'The longitude coordinate of the parking lot.'}
  },
  required: ['id', 'name', 'address', 'distance', 'availability', 'pricePerHour', 'lat', 'lng'],
};

const responseSchema = {
  type: Type.ARRAY,
  items: parkingLotSchema,
};

export async function fetchParkingPredictions(location: string | GeolocationCoordinates): Promise<ParkingLot[]> {
  const now = new Date();
  
  const isCoords = typeof location !== 'string';
  const locationPrompt = isCoords 
    ? `the user's current coordinates: latitude ${location.latitude}, longitude ${location.longitude}`
    : `the user's search query: "${location}"`;

  const prompt = `
    You are a futuristic parking prediction system. Your task is to find real, existing parking lots or garages near a specified location using your tools.
    
    1.  Use the Google Maps tool to find 5 real parking locations based on ${locationPrompt}.
    2.  For each location, generate realistic, plausible data for the current time. Consider factors like time of day (rush hour vs. off-peak), day of the week (weekday vs. weekend), and location type (downtown, residential, commercial). For instance, a downtown garage will be much fuller on a weekday afternoon than a suburban lot.
    3.  Return the data as a JSON array conforming to the provided schema. Ensure you provide accurate latitude and longitude for each location.

    Current Time: ${now.toLocaleTimeString()}
    Current Day: ${now.toLocaleDateString('en-US', { weekday: 'long' })}
  `;

  try {
    const config: any = {
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        tools: [{googleMaps: {}}],
      },
    };

    if (isCoords) {
      config.config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: location.latitude,
            longitude: location.longitude
          }
        }
      }
    }

    const response = await ai.models.generateContent(config);

    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("The AI returned an empty response. There may be no parking spots found for this location.");
    }
    const parkingLots: ParkingLot[] = JSON.parse(jsonText);
    return parkingLots;
  } catch (error: any) {
    console.error("Error fetching parking predictions from Gemini API:", error);
    if (error.message.includes('JSON')) {
        throw new Error("Sorry, we couldn't find parking spots for that location. Please try a different search.");
    }
    throw new Error("Failed to communicate with the AI service. Please check your connection and try again.");
  }
}