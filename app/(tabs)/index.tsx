import { ScrollView, Text, View, TouchableOpacity, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { Activity, UserStatistics } from "@/lib/types";
import { getActivities, getStatistics, calculateStatistics } from "@/lib/storage";
import { cn } from "@/lib/utils";

/**
 * الشاشة الرئيسية - عرض البصمة الكربونية والأنشطة السريعة
 */
export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [todayActivities, setTodayActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // تحميل البيانات عند فتح الشاشة
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const stats = await calculateStatistics();
      setStatistics(stats);

      // الحصول على أنشطة اليوم
      const activities = await getActivities();
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      const todayActs = activities.filter(
        (a) => new Date(a.date).toISOString().split("T")[0] === todayStr
      );
      setTodayActivities(todayActs);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivityPress = (category: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/activity-logger",
      params: { category },
    });
  };

  const handleChallengePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/challenges");
  };

  const activityCategories = [
    { id: "transport", label: "النقل", icon: "🚗", color: "#3B82F6" },
    { id: "energy", label: "الطاقة", icon: "⚡", color: "#FBBF24" },
    { id: "food", label: "الغذاء", icon: "🍽️", color: "#EC4899" },
    { id: "waste", label: "النفايات", icon: "♻️", color: "#8B5CF6" },
  ];

  const dailyTip = {
    title: "نصيحة اليوم",
    description: "استخدم المشي أو الدراجة بدلاً من السيارة لتقليل البصمة الكربونية بنسبة 90%",
    savings: 2.5,
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {/* رأس الصفحة - البصمة الكربونية */}
        <View className="bg-gradient-to-b from-primary/10 to-transparent px-6 pt-6 pb-8">
          <View className="gap-4">
            <View className="gap-2">
              <Text className="text-sm text-muted font-medium">البصمة الكربونية اليومية</Text>
              <View className="flex-row items-baseline gap-2">
                <Text
                  className="text-5xl font-bold text-primary"
                  style={{ color: colors.primary }}
                >
                  {statistics?.averageDailyFootprint.toFixed(1) || "0"}
                </Text>
                <Text className="text-lg text-muted">kg CO2e</Text>
              </View>
            </View>

            {/* مؤشر التقدم */}
            <View className="gap-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-xs text-muted">التقدم الأسبوعي</Text>
                <Text className="text-xs font-semibold text-foreground">
                  {statistics?.weeklyFootprint.toFixed(1) || "0"} kg
                </Text>
              </View>
              <View className="h-2 bg-surface rounded-full overflow-hidden">
                <View
                  className="h-full bg-primary rounded-full"
                  style={{
                    width: `${Math.min(
                      ((statistics?.weeklyFootprint || 0) / 100) * 100,
                      100
                    )}%`,
                    backgroundColor: colors.primary,
                  }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* الأنشطة السريعة */}
        <View className="px-6 py-8 gap-6">
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">سجل نشاطاً جديداً</Text>
            <View className="flex-row flex-wrap gap-3">
              {activityCategories.map((category) => (
                <Pressable
                  key={category.id}
                  onPress={() => handleActivityPress(category.id)}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.7 : 1,
                      transform: [{ scale: pressed ? 0.95 : 1 }],
                    },
                  ]}
                  className="flex-1 min-w-[calc(50%-6px)] bg-surface rounded-2xl p-4 gap-2 items-center justify-center"
                >
                  <Text className="text-3xl">{category.icon}</Text>
                  <Text className="text-sm font-semibold text-foreground text-center">
                    {category.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* أنشطة اليوم */}
          {todayActivities.length > 0 && (
            <View className="gap-3">
              <Text className="text-lg font-bold text-foreground">أنشطة اليوم</Text>
              <View className="gap-2">
                {todayActivities.slice(0, 3).map((activity) => (
                  <View
                    key={activity.id}
                    className="bg-surface rounded-xl p-4 flex-row justify-between items-center"
                  >
                    <View className="gap-1 flex-1">
                      <Text className="font-semibold text-foreground capitalize">
                        {activity.category}
                      </Text>
                      <Text className="text-xs text-muted">{activity.description}</Text>
                    </View>
                    <Text className="font-bold text-primary" style={{ color: colors.primary }}>
                      {activity.carbonFootprint.toFixed(2)} kg
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* التحدي اليومي */}
          <Pressable
            onPress={handleChallengePress}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
            className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-6 gap-3 border border-primary/30"
          >
            <View className="gap-2">
              <Text className="text-lg font-bold text-foreground">🎯 التحدي اليومي</Text>
              <Text className="text-sm text-muted leading-relaxed">
                استخدم وسائل النقل العام 3 مرات اليوم واحفظ 5 كيلوغرام من CO2
              </Text>
            </View>
            <View className="flex-row justify-between items-center pt-2">
              <View className="flex-row gap-2">
                <View className="w-8 h-8 rounded-full bg-primary/20 items-center justify-center">
                  <Text className="text-xs font-bold text-primary">1/3</Text>
                </View>
              </View>
              <Text className="text-xs font-semibold text-primary">قبول التحدي →</Text>
            </View>
          </Pressable>

          {/* نصيحة اليوم */}
          <View className="bg-surface rounded-2xl p-6 gap-3 border border-border">
            <View className="gap-2">
              <Text className="text-lg font-bold text-foreground">💡 {dailyTip.title}</Text>
              <Text className="text-sm text-muted leading-relaxed">{dailyTip.description}</Text>
            </View>
            <View className="flex-row items-center gap-2 pt-2 border-t border-border">
              <Text className="text-xs text-success font-semibold">
                توفير محتمل: {dailyTip.savings} kg CO2e
              </Text>
            </View>
          </View>

          {/* إحصائيات سريعة */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">الإحصائيات</Text>
            <View className="flex-row gap-3">
              <View className="flex-1 bg-surface rounded-xl p-4 gap-2">
                <Text className="text-xs text-muted">إجمالي الأنشطة</Text>
                <Text className="text-2xl font-bold text-foreground">
                  {statistics?.activitiesCount || 0}
                </Text>
              </View>
              <View className="flex-1 bg-surface rounded-xl p-4 gap-2">
                <Text className="text-xs text-muted">التحديات المكتملة</Text>
                <Text className="text-2xl font-bold text-foreground">
                  {statistics?.challengesCompleted || 0}
                </Text>
              </View>
              <View className="flex-1 bg-surface rounded-xl p-4 gap-2">
                <Text className="text-xs text-muted">الشارات</Text>
                <Text className="text-2xl font-bold text-foreground">
                  {statistics?.badgesUnlocked || 0}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
