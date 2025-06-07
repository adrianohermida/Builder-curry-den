// Test file for chart components to ensure they work correctly
import { describe, it, expect } from "vitest";
import { formatCurrency, formatPercentage } from "../chart-components";

describe("Chart Components", () => {
  describe("formatCurrency", () => {
    it("formats currency correctly", () => {
      expect(formatCurrency(1000)).toBe("R$ 1.000");
      expect(formatCurrency(1000.5)).toBe("R$ 1.000,5");
      expect(formatCurrency(0)).toBe("R$ 0");
    });
  });

  describe("formatPercentage", () => {
    it("formats percentage correctly", () => {
      expect(formatPercentage(50)).toBe("50.0%");
      expect(formatPercentage(75.5)).toBe("75.5%");
      expect(formatPercentage(0)).toBe("0.0%");
    });
  });
});
