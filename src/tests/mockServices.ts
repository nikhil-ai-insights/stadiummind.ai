import { STADIUM_NAME } from "../data";
import { Message, Match, Gate, TransportOption, Facility, VolunteerTask } from "../types";

// Simulated server mock responses to test API, error, and fallback state behaviors
export const mockGeminiChatResponse = (userInput: string): string => {
  const normalized = userInput.toLowerCase();
  if (normalized.includes("gate c")) {
    return "Gate C (Metro Entrance) currently has a low queue with an estimated wait time of **5 minutes**. It provides direct access to Sections 129-140.";
  }
  if (normalized.includes("emergency") || normalized.includes("sos")) {
    return "🚨 **CRITICAL SOP DISPATCH**: Medical response has been dispatched. Administer nearest AED located at Section 110. Maintain clearance.";
  }
  if (normalized.includes("sustainability") || normalized.includes("water")) {
    return "♻️ **Green Routing**: Refill your reusable bottle at Section 108 Meadowlands Eco Hub. Bypassing single-use cups saves **0.45kg CO2**.";
  }
  return `StadiumMind AI response to user query: "${userInput}"`;
};

export const mockTranslateResponse = (text: string, targetLanguage: string) => {
  return {
    translatedText: `[Simulated ${targetLanguage}]: ${text}`,
    detectedLanguage: "English"
  };
};

export const mockSustainabilityRouteResponse = (start: string, end: string) => {
  return {
    ecoScore: 94,
    reusableStationsPassed: ["Sec 108 Eco Water Refill Hub", "Recycling Station 4"],
    carbonSavingKg: 0.52,
    tip: `By walking from Section ${start} to ${end}, you bypass plastic vending zones. Refill at Sec 108!`
  };
};

export const mockEmergencyResponse = (type: string, location: string) => {
  return {
    severity: "Critical",
    immediateActions: [
      `Dispatch ambulance and first responders to Section ${location} immediately.`,
      `Secure Gate Bypass at nearest gate area.`
    ],
    checklist: [
      "Check vital signs and maintain crowd boundary.",
      "Dispatch local volunteers to guide paramedics."
    ],
    announcement: `A medical alert has been registered at Section ${location}. Please maintain clear corridors.`
  };
};
