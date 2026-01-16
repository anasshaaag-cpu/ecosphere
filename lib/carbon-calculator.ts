/**
 * خدمة حساب البصمة الكربونية
 * تحتوي على معاملات التحويل والحسابات
 */

import { ActivityCategory, TransportType, EnergyType, FoodType, WasteType } from "./types";

/**
 * معاملات التحويل من الأنشطة إلى kg CO2e
 * المصادر: EPA, IPCC, Carbon Footprint Ltd
 */

// معاملات النقل (kg CO2e per km)
const TRANSPORT_EMISSIONS = {
  [TransportType.CAR]: 0.192, // متوسط السيارة
  [TransportType.BUS]: 0.089, // لكل راكب
  [TransportType.TRAIN]: 0.041, // لكل راكب
  [TransportType.BIKE]: 0, // صفر انبعاثات
  [TransportType.WALK]: 0, // صفر انبعاثات
  [TransportType.FLIGHT]: 0.255, // لكل كم
  [TransportType.MOTORCYCLE]: 0.092,
};

// معاملات الطاقة (kg CO2e per kWh)
const ENERGY_EMISSIONS = {
  [EnergyType.ELECTRICITY]: 0.5, // متوسط عالمي
  [EnergyType.NATURAL_GAS]: 2.04, // per cubic meter
  [EnergyType.HEATING_OIL]: 3.15, // per liter
  [EnergyType.RENEWABLE]: 0, // صفر انبعاثات
};

// معاملات الغذاء (kg CO2e per kg)
const FOOD_EMISSIONS = {
  [FoodType.MEAT]: 27, // لحم البقر
  [FoodType.DAIRY]: 1.23, // منتجات الألبان
  [FoodType.VEGETABLES]: 0.2,
  [FoodType.FRUITS]: 0.48,
  [FoodType.GRAINS]: 0.8,
  [FoodType.OTHER]: 1.5,
};

// معاملات النفايات (kg CO2e per kg)
const WASTE_EMISSIONS = {
  [WasteType.PLASTIC]: 6, // إنتاج + معالجة
  [WasteType.PAPER]: 1.5,
  [WasteType.ORGANIC]: 0.5,
  [WasteType.METAL]: 8,
  [WasteType.GLASS]: 0.7,
  [WasteType.ELECTRONIC]: 15,
};

/**
 * حساب البصمة الكربونية للنقل
 * @param distance المسافة بالكيلومتر
 * @param type نوع المركبة
 * @returns البصمة الكربونية بـ kg CO2e
 */
export function calculateTransportEmissions(distance: number, type: TransportType): number {
  const emission = TRANSPORT_EMISSIONS[type] || 0;
  return distance * emission;
}

/**
 * حساب البصمة الكربونية للطاقة
 * @param consumption الاستهلاك بـ kWh أو وحدات أخرى
 * @param type نوع الطاقة
 * @returns البصمة الكربونية بـ kg CO2e
 */
export function calculateEnergyEmissions(consumption: number, type: EnergyType): number {
  const emission = ENERGY_EMISSIONS[type] || 0;
  return consumption * emission;
}

/**
 * حساب البصمة الكربونية للغذاء
 * @param weight الوزن بالكيلوغرام
 * @param type نوع الغذاء
 * @returns البصمة الكربونية بـ kg CO2e
 */
export function calculateFoodEmissions(weight: number, type: FoodType): number {
  const emission = FOOD_EMISSIONS[type] || 0;
  return weight * emission;
}

/**
 * حساب البصمة الكربونية للنفايات
 * @param weight الوزن بالكيلوغرام
 * @param type نوع النفايات
 * @returns البصمة الكربونية بـ kg CO2e
 */
export function calculateWasteEmissions(weight: number, type: WasteType): number {
  const emission = WASTE_EMISSIONS[type] || 0;
  return weight * emission;
}

/**
 * حساب البصمة الكربونية الإجمالية بناءً على الفئة والقيمة
 * @param category فئة النشاط
 * @param value القيمة
 * @param type النوع المحدد
 * @returns البصمة الكربونية بـ kg CO2e
 */
export function calculateCarbonFootprint(
  category: ActivityCategory,
  value: number,
  type?: string
): number {
  switch (category) {
    case ActivityCategory.TRANSPORT:
      return calculateTransportEmissions(value, (type as TransportType) || TransportType.CAR);
    case ActivityCategory.ENERGY:
      return calculateEnergyEmissions(value, (type as EnergyType) || EnergyType.ELECTRICITY);
    case ActivityCategory.FOOD:
      return calculateFoodEmissions(value, (type as FoodType) || FoodType.OTHER);
    case ActivityCategory.WASTE:
      return calculateWasteEmissions(value, (type as WasteType) || WasteType.PLASTIC);
    case ActivityCategory.OTHER:
      return value * 0.5; // معامل افتراضي
    default:
      return 0;
  }
}

/**
 * الحصول على وصف الانبعاثات
 * @param emissions البصمة الكربونية بـ kg CO2e
 * @returns وصف نصي للانبعاثات
 */
export function getEmissionsDescription(emissions: number): string {
  if (emissions < 1) {
    return `${(emissions * 1000).toFixed(0)}g CO2e`;
  } else if (emissions < 1000) {
    return `${emissions.toFixed(2)}kg CO2e`;
  } else {
    return `${(emissions / 1000).toFixed(2)}t CO2e`;
  }
}

/**
 * مقارنة الانبعاثات بمعايير مرجعية
 * @param emissions البصمة الكربونية بـ kg CO2e
 * @returns معلومات المقارنة
 */
export function compareEmissions(emissions: number): {
  comparison: string;
  percentage: number;
  recommendation: string;
} {
  // المتوسط العالمي للبصمة الكربونية السنوية: ~4 طن
  const globalAverageAnnual = 4000; // kg CO2e
  const globalAverageDaily = globalAverageAnnual / 365; // ~10.96 kg CO2e

  const percentage = (emissions / globalAverageDaily) * 100;

  let comparison = "";
  let recommendation = "";

  if (percentage < 50) {
    comparison = "أقل بكثير من المتوسط العالمي 🌟";
    recommendation = "أنت تقوم بعمل رائع! استمر في الحفاظ على هذا المستوى.";
  } else if (percentage < 100) {
    comparison = "أقل من المتوسط العالمي ✅";
    recommendation = "أنت على المسار الصحيح. حاول تقليل الانبعاثات أكثر.";
  } else if (percentage < 150) {
    comparison = "قريب من المتوسط العالمي ⚠️";
    recommendation = "هناك مجال للتحسن. ركز على تقليل النقل والطاقة.";
  } else {
    comparison = "أعلى من المتوسط العالمي ❌";
    recommendation = "يجب اتخاذ إجراءات فورية. ابدأ بتقليل استهلاك الطاقة والنقل.";
  }

  return {
    comparison,
    percentage: Math.round(percentage),
    recommendation,
  };
}

/**
 * حساب الوفورات المحتملة من خلال تغيير السلوك
 * @param currentType النوع الحالي
 * @param newType النوع الجديد
 * @param value القيمة
 * @param category الفئة
 * @returns الوفورات بـ kg CO2e
 */
export function calculatePotentialSavings(
  currentType: string,
  newType: string,
  value: number,
  category: ActivityCategory
): number {
  const currentEmissions = calculateCarbonFootprint(category, value, currentType);
  const newEmissions = calculateCarbonFootprint(category, value, newType);
  return currentEmissions - newEmissions;
}
