import { describe, it, expect } from "vitest";
import {
  calculateTransportEmissions,
  calculateEnergyEmissions,
  calculateFoodEmissions,
  calculateWasteEmissions,
  calculateCarbonFootprint,
  getEmissionsDescription,
  compareEmissions,
} from "../carbon-calculator";
import { ActivityCategory, TransportType, EnergyType, FoodType, WasteType } from "../types";

describe("Carbon Calculator", () => {
  describe("calculateTransportEmissions", () => {
    it("should calculate car emissions correctly", () => {
      const emissions = calculateTransportEmissions(100, TransportType.CAR);
      expect(emissions).toBeCloseTo(19.2, 1);
    });

    it("should calculate bus emissions correctly", () => {
      const emissions = calculateTransportEmissions(100, TransportType.BUS);
      expect(emissions).toBeCloseTo(8.9, 1);
    });

    it("should return zero for walking", () => {
      const emissions = calculateTransportEmissions(100, TransportType.WALK);
      expect(emissions).toBe(0);
    });

    it("should return zero for biking", () => {
      const emissions = calculateTransportEmissions(100, TransportType.BIKE);
      expect(emissions).toBe(0);
    });
  });

  describe("calculateEnergyEmissions", () => {
    it("should calculate electricity emissions correctly", () => {
      const emissions = calculateEnergyEmissions(100, EnergyType.ELECTRICITY);
      expect(emissions).toBeCloseTo(50, 1);
    });

    it("should return zero for renewable energy", () => {
      const emissions = calculateEnergyEmissions(100, EnergyType.RENEWABLE);
      expect(emissions).toBe(0);
    });
  });

  describe("calculateFoodEmissions", () => {
    it("should calculate meat emissions correctly", () => {
      const emissions = calculateFoodEmissions(1, FoodType.MEAT);
      expect(emissions).toBeCloseTo(27, 1);
    });

    it("should calculate vegetable emissions correctly", () => {
      const emissions = calculateFoodEmissions(1, FoodType.VEGETABLES);
      expect(emissions).toBeCloseTo(0.2, 1);
    });
  });

  describe("calculateWasteEmissions", () => {
    it("should calculate plastic waste emissions correctly", () => {
      const emissions = calculateWasteEmissions(1, WasteType.PLASTIC);
      expect(emissions).toBeCloseTo(6, 1);
    });

    it("should calculate paper waste emissions correctly", () => {
      const emissions = calculateWasteEmissions(1, WasteType.PAPER);
      expect(emissions).toBeCloseTo(1.5, 1);
    });
  });

  describe("calculateCarbonFootprint", () => {
    it("should calculate transport footprint", () => {
      const emissions = calculateCarbonFootprint(ActivityCategory.TRANSPORT, 100, TransportType.CAR);
      expect(emissions).toBeCloseTo(19.2, 1);
    });

    it("should calculate energy footprint", () => {
      const emissions = calculateCarbonFootprint(ActivityCategory.ENERGY, 100, EnergyType.ELECTRICITY);
      expect(emissions).toBeCloseTo(50, 1);
    });

    it("should calculate food footprint", () => {
      const emissions = calculateCarbonFootprint(ActivityCategory.FOOD, 1, FoodType.MEAT);
      expect(emissions).toBeCloseTo(27, 1);
    });

    it("should calculate waste footprint", () => {
      const emissions = calculateCarbonFootprint(ActivityCategory.WASTE, 1, WasteType.PLASTIC);
      expect(emissions).toBeCloseTo(6, 1);
    });

    it("should handle other category", () => {
      const emissions = calculateCarbonFootprint(ActivityCategory.OTHER, 10);
      expect(emissions).toBeCloseTo(5, 1);
    });
  });

  describe("getEmissionsDescription", () => {
    it("should format grams correctly", () => {
      const desc = getEmissionsDescription(0.5);
      expect(desc).toContain("500g");
    });

    it("should format kilograms correctly", () => {
      const desc = getEmissionsDescription(50);
      expect(desc).toContain("kg");
    });

    it("should format tons correctly", () => {
      const desc = getEmissionsDescription(5000);
      expect(desc).toContain("t");
    });
  });

  describe("compareEmissions", () => {
    it("should identify very low emissions", () => {
      const result = compareEmissions(2);
      expect(result.percentage).toBeLessThan(50);
      expect(result.comparison).toContain("أقل بكثير");
    });

    it("should identify average emissions", () => {
      const result = compareEmissions(11);
      expect(result.percentage).toBeGreaterThanOrEqual(100);
      expect(result.percentage).toBeLessThan(150);
    });

    it("should provide recommendations", () => {
      const result = compareEmissions(20);
      expect(result.recommendation).toBeTruthy();
    });
  });
});
