import { ScrollView, Text, View, Pressable, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { Activity, UserStatistics } from "@/lib/types";
import { getActivities, calculateStatistics } from "@/lib/storage";

const ACTIVITY_CATEGORIES = [
  { id: "transport", label: "النقل", icon: "🚗", color: "#3B82F6" },
  { id: "energy", label: "الطاقة", icon: "⚡", color: "#FBBF24" },
  { id: "food", label: "الغذاء", icon: "🍽️", color: "#EC4899" },
  { id: "waste", label: "النفايات", icon: "♻️", color: "#8B5CF6" },
];

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [todayActivities, setTodayActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const stats = await calculateStatistics();
      setStatistics(stats);

      const activities = await getActivities();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayActivities = activities.filter((a) => {
        const actDate = new Date(a.date);
        actDate.setHours(0, 0, 0, 0);
        return actDate.getTime() === today.getTime();
      });
      setTodayActivities(todayActivities);
    } catch (error) {
      console.error("Error loading home data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivityPress = (category: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push({
      pathname: "/activity-logger",
      params: { category },
    });
  };

  const todayFootprint = todayActivities.reduce((sum, a) => sum + a.carbonFootprint, 0);

  return (
    <ScreenContainer className="p-4 md:p-8 lg:p-12">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 max-w-6xl mx-auto w-full">
          {/* رأس الصفحة */}
          <View className="gap-2">
            <Text className="text-4xl md:text-5xl font-bold text-foreground">
              🌍 مرحباً بك في EcoSphere
            </Text>
            <Text className="text-base md:text-lg text-muted">
              تتبع بصمتك الكربونية وساهم في مستقبل أخضر
            </Text>
          </View>

          {/* بطاقة البصمة الرئيسية */}
          <View className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-6 md:p-8 gap-4 border border-primary/20">
            <View className="gap-2">
              <Text className="text-sm md:text-base text-muted">البصمة الكربونية اليومية</Text>
              <View className="flex-row items-baseline gap-2">
                <Text
                  className="text-5xl md:text-6xl font-bold"
                  style={{ color: colors.primary }}
                >
                  {todayFootprint.toFixed(2)}
                </Text>
                <Text className="text-lg md:text-xl text-muted">kg CO2e</Text>
              </View>
            </View>

            {/* شريط التقدم الأسبوعي */}
            <View className="gap-2 pt-4 border-t border-primary/20">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">التقدم الأسبوعي</Text>
                <Text className="text-sm font-bold text-foreground">
                  {statistics?.weeklyFootprint.toFixed(1) || "0"} kg
                </Text>
              </View>
              <View className="h-3 bg-primary/20 rounded-full overflow-hidden">
                <View
                  className="h-full bg-primary rounded-full"
                  style={{
                    width: `${Math.min((statistics?.weeklyFootprint || 0) / 100, 1) * 100}%`,
                    backgroundColor: colors.primary,
                  }}
                />
              </View>
            </View>
          </View>

          {/* شبكة الإحصائيات السريعة */}
          <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <View className="bg-surface rounded-2xl p-4 border border-border gap-2">
              <Text className="text-xs text-muted">المتوسط اليومي</Text>
              <Text className="text-2xl font-bold text-foreground">
                {statistics?.averageDailyFootprint.toFixed(2) || "0"}
              </Text>
              <Text className="text-xs text-muted">kg CO2e</Text>
            </View>
            <View className="bg-surface rounded-2xl p-4 border border-border gap-2">
              <Text className="text-xs text-muted">هذا الأسبوع</Text>
              <Text className="text-2xl font-bold text-foreground">
                {statistics?.weeklyFootprint.toFixed(1) || "0"}
              </Text>
              <Text className="text-xs text-muted">kg CO2e</Text>
            </View>
            <View className="bg-surface rounded-2xl p-4 border border-border gap-2">
              <Text className="text-xs text-muted">هذا الشهر</Text>
              <Text className="text-2xl font-bold text-foreground">
                {statistics?.monthlyFootprint.toFixed(1) || "0"}
              </Text>
              <Text className="text-xs text-muted">kg CO2e</Text>
            </View>
            <View className="bg-surface rounded-2xl p-4 border border-border gap-2">
              <Text className="text-xs text-muted">إجمالي الأنشطة</Text>
              <Text className="text-2xl font-bold text-foreground">
                {statistics?.activitiesCount || 0}
              </Text>
              <Text className="text-xs text-muted">نشاط مسجل</Text>
            </View>
          </View>

          {/* قسم تسجيل النشاط */}
          <View className="gap-4">
            <View className="gap-2">
              <Text className="text-2xl font-bold text-foreground">📝 سجل نشاطاً جديداً</Text>
              <Text className="text-sm text-muted">اختر نوع النشاط لتسجيل البصمة الكربونية</Text>
            </View>

            <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {ACTIVITY_CATEGORIES.map((category) => (
                <Pressable
                  key={category.id}
                  onPress={() => handleActivityPress(category.id)}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.7 : 1,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                  ]}
                  className="bg-surface rounded-2xl p-6 items-center gap-3 border border-border hover:border-primary transition-colors"
                >
                  <Text className="text-4xl">{category.icon}</Text>
                  <Text className="text-lg font-bold text-foreground text-center">
                    {category.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* التحدي اليومي */}
          <View className="bg-warning/10 rounded-2xl p-6 gap-4 border border-warning/20">
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl">🎯</Text>
              <Text className="text-xl font-bold text-foreground">التحدي اليومي</Text>
            </View>
            <Text className="text-base text-foreground">
              استخدم وسائل النقل العام 3 مرات اليوم واحفظ 5 كيلوغرامات من CO2
            </Text>
            <View className="gap-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">التقدم</Text>
                <Text className="text-sm font-bold text-foreground">1/3</Text>
              </View>
              <View className="h-2 bg-warning/20 rounded-full overflow-hidden">
                <View className="h-full bg-warning rounded-full" style={{ width: "33%" }} />
              </View>
            </View>
            <Text className="text-xs text-muted">توفير محتمل: 2.5 kg CO2e</Text>
          </View>

          {/* نصيحة اليوم */}
          <View className="bg-success/10 rounded-2xl p-6 gap-3 border border-success/20">
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl">💡</Text>
              <Text className="text-lg font-bold text-foreground">نصيحة اليوم</Text>
            </View>
            <Text className="text-base text-foreground leading-relaxed">
              استخدم المشي أو الدراجة الهوائية بدلاً من السيارة لمسافات قصيرة. هذا يقلل البصمة
              الكربونية بنسبة 90% مقارنة بالسيارة العادية.
            </Text>
          </View>

          {/* أنشطة اليوم */}
          {todayActivities.length > 0 && (
            <View className="gap-4">
              <Text className="text-2xl font-bold text-foreground">📊 أنشطة اليوم</Text>
              <View className="gap-3">
                {todayActivities.map((activity) => (
                  <View
                    key={activity.id}
                    className="bg-surface rounded-xl p-4 border border-border flex-row justify-between items-center"
                  >
                    <View className="gap-1">
                      <Text className="font-semibold text-foreground">
                        {activity.category}
                      </Text>
                      <Text className="text-xs text-muted">
                        {new Date(activity.date).toLocaleTimeString("ar-SA")}
                      </Text>
                    </View>
                    <View className="items-end gap-1">
                      <Text className="font-bold text-primary" style={{ color: colors.primary }}>
                        {activity.carbonFootprint.toFixed(2)} kg
                      </Text>
                      <Text className="text-xs text-muted">{activity.value} {activity.unit}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
