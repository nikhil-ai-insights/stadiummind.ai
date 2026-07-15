import { describe, test, expect } from "vitest";
import { checkColorContrast, getAccessibilityFontSizeClass, validateAriaAnnouncement } from "./testUtils";

describe("StadiumMind UI & Accessibility Unit Tests", () => {
  test("Verify color contrast of immersive UI components meets WCAG AA standards (>= 4.5:1)", () => {
    // Dark mode canvas backgrounds and text pairings
    const backgroundHex = "#050505";
    const brandPrimaryHex = "#00E676"; // High contrast emerald
    const lightTextHex = "#FFFFFF";
    const darkGrayTextHex = "#BDBDBD";

    // Standard high-contrast emerald text on dark canvas
    const emeraldContrast = checkColorContrast(brandPrimaryHex, backgroundHex);
    expect(emeraldContrast).toBeGreaterThanOrEqual(4.5); // Meets AA standards

    // Standard white text on dark canvas
    const whiteContrast = checkColorContrast(lightTextHex, backgroundHex);
    expect(whiteContrast).toBeGreaterThanOrEqual(7.0); // Meets AAA standards!

    // Muted grey text on dark canvas
    const greyContrast = checkColorContrast(darkGrayTextHex, backgroundHex);
    expect(greyContrast).toBeGreaterThanOrEqual(4.5); // Meets AA standard for legible UI descriptions
  });

  test("Verify font size adjustment mapping for large/extra-large configurations", () => {
    expect(getAccessibilityFontSizeClass("normal")).toBe("text-sm");
    expect(getAccessibilityFontSizeClass("large")).toBe("text-lg");
    expect(getAccessibilityFontSizeClass("extra-large")).toBe("text-xl");
  });

  test("Verify screen reader accessibility announcements format", () => {
    const validAnnouncement = "Medical support is en route to Section 114. Please make way.";
    const invalidAnnouncement = "Emergency alert at gate!";

    expect(validateAriaAnnouncement(validAnnouncement)).toBe(true);
    expect(validateAriaAnnouncement(invalidAnnouncement)).toBe(false);
  });
});
