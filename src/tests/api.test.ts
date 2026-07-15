import { describe, test, expect, vi } from "vitest";
import { mockGeminiChatResponse, mockTranslateResponse, mockSustainabilityRouteResponse, mockEmergencyResponse } from "./mockServices";
import { isSectionValid } from "./testUtils";

describe("StadiumMind AI API Unit Tests", () => {
  test("Should generate appropriate chatbot response based on user input", () => {
    const gateResponse = mockGeminiChatResponse("where is Gate C?");
    expect(gateResponse).toContain("Gate C");
    expect(gateResponse).toContain("5 minutes");

    const emergencyResponse = mockGeminiChatResponse("Emergency alert: attendee collapsed in Sec 110!");
    expect(emergencyResponse).toContain("DISPATCH");
    expect(emergencyResponse).toContain("Section 110");

    const fallbackResponse = mockGeminiChatResponse("Who is leading the game?");
    expect(fallbackResponse).toContain("StadiumMind AI response");
  });

  test("Should generate correct translate API structure and responses", () => {
    const result = mockTranslateResponse("Proceed to exit Gate D", "Spanish");
    expect(result.translatedText).toBe("[Simulated Spanish]: Proceed to exit Gate D");
    expect(result.detectedLanguage).toBe("English");
  });

  test("Should handle sustainability route estimation correctly", () => {
    const startSection = "120";
    const endSection = "108";
    
    expect(isSectionValid(startSection)).toBe(true);
    expect(isSectionValid(endSection)).toBe(true);

    const result = mockSustainabilityRouteResponse(startSection, endSection);
    expect(result.ecoScore).toBeGreaterThanOrEqual(90);
    expect(result.carbonSavingKg).toBe(0.52);
    expect(result.reusableStationsPassed).toContain("Sec 108 Eco Water Refill Hub");
  });

  test("Should produce valid crisis coordinating checklists during emergencies", () => {
    const crisisType = "Medical";
    const location = "Section 131";

    const result = mockEmergencyResponse(crisisType, location);
    expect(result.severity).toBe("Critical");
    expect(result.immediateActions[0]).toContain("Section 131");
    expect(result.checklist[0]).toContain("vital signs");
    expect(result.announcement).toContain("medical alert");
  });

  test("Should guard against invalid inputs or malicious sections", () => {
    const invalidSection = "999";
    const injectionAttempt = "Section 123; DROP TABLE users;";

    expect(isSectionValid(invalidSection)).toBe(false);
    expect(isSectionValid(injectionAttempt)).toBe(false);
  });
});
