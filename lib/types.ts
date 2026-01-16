/**
 * أنواع البيانات الأساسية لتطبيق EcoSphere
 */

/**
 * فئات الأنشطة المختلفة
 */
export enum ActivityCategory {
  TRANSPORT = "transport",
  ENERGY = "energy",
  FOOD = "food",
  WASTE = "waste",
  OTHER = "other",
}

/**
 * أنواع وسائل النقل
 */
export enum TransportType {
  CAR = "car",
  BUS = "bus",
  TRAIN = "train",
  BIKE = "bike",
  WALK = "walk",
  FLIGHT = "flight",
  MOTORCYCLE = "motorcycle",
}

/**
 * أنواع الطاقة
 */
export enum EnergyType {
  ELECTRICITY = "electricity",
  NATURAL_GAS = "natural_gas",
  HEATING_OIL = "heating_oil",
  RENEWABLE = "renewable",
}

/**
 * أنواع الغذاء
 */
export enum FoodType {
  MEAT = "meat",
  DAIRY = "dairy",
  VEGETABLES = "vegetables",
  FRUITS = "fruits",
  GRAINS = "grains",
  OTHER = "other",
}

/**
 * أنواع النفايات
 */
export enum WasteType {
  PLASTIC = "plastic",
  PAPER = "paper",
  ORGANIC = "organic",
  METAL = "metal",
  GLASS = "glass",
  ELECTRONIC = "electronic",
}

/**
 * نموذج النشاط
 */
export interface Activity {
  id: string;
  category: ActivityCategory;
  date: Date;
  value: number;
  unit: string;
  carbonFootprint: number; // kg CO2e
  description?: string;
  type?: string; // نوع محدد ضمن الفئة
  notes?: string;
}

/**
 * نموذج التحدي
 */
export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  target: number;
  unit: string;
  startDate: Date;
  endDate: Date;
  isCompleted: boolean;
  progress: number;
  reward?: string;
  carbonSavings?: number; // kg CO2e
}

/**
 * نموذج الشارة/الإنجاز
 */
export interface Badge {
  id: string;
  title: string;
  description: string;
  icon?: string;
  unlockedDate?: Date;
  requirement: string;
}

/**
 * نموذج المستخدم
 */
export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  createdAt: Date;
  preferences: UserPreferences;
  statistics: UserStatistics;
}

/**
 * تفضيلات المستخدم
 */
export interface UserPreferences {
  unit: "metric" | "imperial";
  language: "ar" | "en";
  notifications: boolean;
  darkMode: boolean;
  theme: "light" | "dark" | "auto";
}

/**
 * إحصائيات المستخدم
 */
export interface UserStatistics {
  totalCarbonFootprint: number; // kg CO2e
  averageDailyFootprint: number;
  weeklyFootprint: number;
  monthlyFootprint: number;
  yearlyFootprint: number;
  activitiesCount: number;
  challengesCompleted: number;
  badgesUnlocked: number;
  bestStreak: number; // عدد الأيام المتتالية
  currentStreak: number;
}

/**
 * نموذج النصيحة
 */
export interface Tip {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  carbonSavings: number; // kg CO2e
  difficulty: "easy" | "medium" | "hard";
  icon?: string;
}

/**
 * نموذج الإحصائيات اليومية
 */
export interface DailyStatistics {
  date: Date;
  totalFootprint: number;
  activities: Activity[];
  byCategory: {
    [key in ActivityCategory]?: number;
  };
}

/**
 * نموذج الفترة الزمنية
 */
export type TimePeriod = "day" | "week" | "month" | "year";

/**
 * نموذج البيانات المصدرة
 */
export interface ExportData {
  user: User;
  activities: Activity[];
  challenges: Challenge[];
  badges: Badge[];
  statistics: UserStatistics;
  exportDate: Date;
}
