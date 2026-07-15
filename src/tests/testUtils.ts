import { AccessibilityConfig } from "../types";

// Standard WCAG 2.1 Contrast ratios and accessible check utilities
export const checkColorContrast = (hex1: string, hex2: string): number => {
  const getRGB = (hex: string) => {
    const color = hex.replace("#", "");
    const r = parseInt(color.substring(0, 2), 16) / 255;
    const g = parseInt(color.substring(2, 4), 16) / 255;
    const b = parseInt(color.substring(4, 6), 16) / 255;
    return [r, g, b].map(col => {
      if (col <= 0.03928) {
        return col / 12.92;
      }
      return Math.pow((col + 0.055) / 1.055, 2.4);
    });
  };

  const l1 = 0.2126 * getRGB(hex1)[0] + 0.7152 * getRGB(hex1)[1] + 0.0722 * getRGB(hex1)[2];
  const l2 = 0.2126 * getRGB(hex2)[0] + 0.7152 * getRGB(hex2)[1] + 0.0722 * getRGB(hex2)[2];
  
  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  return (brightest + 0.05) / (darkest + 0.05);
};

// Check font size configurations for Accessibility
export const getAccessibilityFontSizeClass = (fontSize: AccessibilityConfig["fontSize"]): string => {
  switch (fontSize) {
    case "large":
      return "text-lg";
    case "extra-large":
      return "text-xl";
    case "normal":
    default:
      return "text-sm";
  }
};

// Validate that an emergency announcement text is readable for screen readers
export const validateAriaAnnouncement = (announcement: string): boolean => {
  return announcement.length > 0 && announcement.includes("Section");
};

// Test edge case of invalid section or seat ranges
export const isSectionValid = (section: string): boolean => {
  const secNum = parseInt(section, 10);
  return !isNaN(secNum) && secNum >= 100 && secNum <= 399;
};
