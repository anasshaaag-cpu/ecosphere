/**
 * خدمة تخزين البيانات المحلية
 * تستخدم AsyncStorage لحفظ واسترجاع البيانات
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Activity, Challenge, Badge, User, UserPreferences, UserStatistics } from "./types";

const STORAGE_KEYS = {
  USER: "ecosphere_user",
  ACTIVITIES: "ecosphere_activities",
  CHALLENGES: "ecosphere_challenges",
  BADGES: "ecosphere_badges",
  PREFERENCES: "ecosphere_preferences",
  STATISTICS: "ecosphere_statistics",
};

/**
 * حفظ بيانات المستخدم
 */
export async function saveUser(user: User): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user:", error);
    throw error;
  }
}

/**
 * استرجاع بيانات المستخدم
 */
export async function getUser(): Promise<User | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

/**
 * حفظ نشاط جديد
 */
export async function saveActivity(activity: Activity): Promise<void> {
  try {
    const activities = await getActivities();
    activities.push(activity);
    await AsyncStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  } catch (error) {
    console.error("Error saving activity:", error);
    throw error;
  }
}

/**
 * استرجاع جميع الأنشطة
 */
export async function getActivities(): Promise<Activity[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting activities:", error);
    return [];
  }
}

/**
 * استرجاع الأنشطة حسب التاريخ
 */
export async function getActivitiesByDate(date: Date): Promise<Activity[]> {
  try {
    const activities = await getActivities();
    const dateStr = date.toISOString().split("T")[0];
    return activities.filter((a) => new Date(a.date).toISOString().split("T")[0] === dateStr);
  } catch (error) {
    console.error("Error getting activities by date:", error);
    return [];
  }
}

/**
 * استرجاع الأنشطة خلال فترة زمنية
 */
export async function getActivitiesByPeriod(startDate: Date, endDate: Date): Promise<Activity[]> {
  try {
    const activities = await getActivities();
    return activities.filter((a) => {
      const activityDate = new Date(a.date);
      return activityDate >= startDate && activityDate <= endDate;
    });
  } catch (error) {
    console.error("Error getting activities by period:", error);
    return [];
  }
}

/**
 * حذف نشاط
 */
export async function deleteActivity(activityId: string): Promise<void> {
  try {
    const activities = await getActivities();
    const filtered = activities.filter((a) => a.id !== activityId);
    await AsyncStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting activity:", error);
    throw error;
  }
}

/**
 * حفظ تحدي جديد
 */
export async function saveChallenge(challenge: Challenge): Promise<void> {
  try {
    const challenges = await getChallenges();
    challenges.push(challenge);
    await AsyncStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
  } catch (error) {
    console.error("Error saving challenge:", error);
    throw error;
  }
}

/**
 * استرجاع جميع التحديات
 */
export async function getChallenges(): Promise<Challenge[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CHALLENGES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting challenges:", error);
    return [];
  }
}

/**
 * تحديث تحدي
 */
export async function updateChallenge(challenge: Challenge): Promise<void> {
  try {
    const challenges = await getChallenges();
    const index = challenges.findIndex((c) => c.id === challenge.id);
    if (index !== -1) {
      challenges[index] = challenge;
      await AsyncStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
    }
  } catch (error) {
    console.error("Error updating challenge:", error);
    throw error;
  }
}

/**
 * حفظ شارة جديدة
 */
export async function saveBadge(badge: Badge): Promise<void> {
  try {
    const badges = await getBadges();
    badges.push(badge);
    await AsyncStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
  } catch (error) {
    console.error("Error saving badge:", error);
    throw error;
  }
}

/**
 * استرجاع جميع الشارات
 */
export async function getBadges(): Promise<Badge[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.BADGES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting badges:", error);
    return [];
  }
}

/**
 * حفظ التفضيلات
 */
export async function savePreferences(preferences: UserPreferences): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error("Error saving preferences:", error);
    throw error;
  }
}

/**
 * استرجاع التفضيلات
 */
export async function getPreferences(): Promise<UserPreferences> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return data
      ? JSON.parse(data)
      : {
          unit: "metric",
          language: "ar",
          notifications: true,
          darkMode: false,
          theme: "auto",
        };
  } catch (error) {
    console.error("Error getting preferences:", error);
    return {
      unit: "metric",
      language: "ar",
      notifications: true,
      darkMode: false,
      theme: "auto",
    };
  }
}

/**
 * حفظ الإحصائيات
 */
export async function saveStatistics(statistics: UserStatistics): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.STATISTICS, JSON.stringify(statistics));
  } catch (error) {
    console.error("Error saving statistics:", error);
    throw error;
  }
}

/**
 * استرجاع الإحصائيات
 */
export async function getStatistics(): Promise<UserStatistics> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.STATISTICS);
    return data
      ? JSON.parse(data)
      : {
          totalCarbonFootprint: 0,
          averageDailyFootprint: 0,
          weeklyFootprint: 0,
          monthlyFootprint: 0,
          yearlyFootprint: 0,
          activitiesCount: 0,
          challengesCompleted: 0,
          badgesUnlocked: 0,
          bestStreak: 0,
          currentStreak: 0,
        };
  } catch (error) {
    console.error("Error getting statistics:", error);
    return {
      totalCarbonFootprint: 0,
      averageDailyFootprint: 0,
      weeklyFootprint: 0,
      monthlyFootprint: 0,
      yearlyFootprint: 0,
      activitiesCount: 0,
      challengesCompleted: 0,
      badgesUnlocked: 0,
      bestStreak: 0,
      currentStreak: 0,
    };
  }
}

/**
 * مسح جميع البيانات
 */
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error("Error clearing data:", error);
    throw error;
  }
}

/**
 * حساب الإحصائيات من الأنشطة
 */
export async function calculateStatistics(): Promise<UserStatistics> {
  try {
    const activities = await getActivities();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    const yearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

    const todayActivities = activities.filter((a) => {
      const actDate = new Date(a.date);
      return actDate >= today;
    });

    const weekActivities = activities.filter((a) => {
      const actDate = new Date(a.date);
      return actDate >= weekAgo;
    });

    const monthActivities = activities.filter((a) => {
      const actDate = new Date(a.date);
      return actDate >= monthAgo;
    });

    const yearActivities = activities.filter((a) => {
      const actDate = new Date(a.date);
      return actDate >= yearAgo;
    });

    const totalFootprint = activities.reduce((sum, a) => sum + a.carbonFootprint, 0);
    const weekFootprint = weekActivities.reduce((sum, a) => sum + a.carbonFootprint, 0);
    const monthFootprint = monthActivities.reduce((sum, a) => sum + a.carbonFootprint, 0);
    const yearFootprint = yearActivities.reduce((sum, a) => sum + a.carbonFootprint, 0);

    const stats = await getStatistics();
    const challenges = await getChallenges();
    const badges = await getBadges();

    return {
      totalCarbonFootprint: totalFootprint,
      averageDailyFootprint: activities.length > 0 ? totalFootprint / activities.length : 0,
      weeklyFootprint: weekFootprint,
      monthlyFootprint: monthFootprint,
      yearlyFootprint: yearFootprint,
      activitiesCount: activities.length,
      challengesCompleted: challenges.filter((c) => c.isCompleted).length,
      badgesUnlocked: badges.length,
      bestStreak: stats.bestStreak,
      currentStreak: stats.currentStreak,
    };
  } catch (error) {
    console.error("Error calculating statistics:", error);
    return {
      totalCarbonFootprint: 0,
      averageDailyFootprint: 0,
      weeklyFootprint: 0,
      monthlyFootprint: 0,
      yearlyFootprint: 0,
      activitiesCount: 0,
      challengesCompleted: 0,
      badgesUnlocked: 0,
      bestStreak: 0,
      currentStreak: 0,
    };
  }
}
