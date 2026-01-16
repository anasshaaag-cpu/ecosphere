import { ScrollView, Text, View, Platform } from "react-native";
import { useEffect, useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { UserStatistics } from "@/lib/types";
import { calculateStatistics, getActivities } from "@/lib/storage";

export default function AnalyticsScreen() {
  const colors = useColors();
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState<Record<string, number>>({});
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
      const breakdown: Record<string, number> = {};
      activities.forEach((activity) => {
        if (!breakdown[activity.category]) {
          breakdown[activity.category] = 0;
        }
        breakdown[activity.category] += activity.carbonFootprint;
      });
      setCategoryBreakdown(breakdown);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      transport: "#3B82F6",
      energy: "#FBBF24",
      food: "#EC4899",
      waste: "#8B5CF6",
      other: "#6B7280",
    };
    return colors[category] || "#6B7280";
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      transport: "النقل",
      energy: "الطاقة",
      food: "الغذاء",
      waste: "النفايات",
      other: "أخرى",
    };
    return labels[category] || category;
  };

  const totalFootprint = Object.values(categoryBreakdown).reduce((a, b) => a + b, 0);

  return (
    <ScreenContainer className="p-4 md:p-8 lg:p-12">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 max-w-6xl mx-auto w-full">
          {/* رأس الصفحة */}
          <View className="gap-2">
            <Text className="text-4xl md:text-5xl font-bold text-foreground">📊 الإحصائيات</Text>
            <Text className="text-base md:text-lg text-muted">
              تحليل شامل لبصمتك الكربونية
            </Text>
          </View>

          {/* الإحصائيات الرئيسية */}
          <View className="gap-3">
            <Text className="text-2xl font-bold text-foreground">الملخص</Text>

            {/* إجمالي البصمة */}
            <View className="bg-surface rounded-2xl p-6 md:p-8 gap-3 border border-border">
              <Text className="text-sm text-muted">إجمالي البصمة الكربونية</Text>
              <View className="flex-row items-baseline gap-2">
                <Text className="text-5xl md:text-6xl font-bold text-primary" style={{ color: colors.primary }}>
                  {statistics?.totalCarbonFootprint.toFixed(1) || "0"}
                </Text>
                <Text className="text-lg md:text-xl text-muted">kg CO2e</Text>
              </View>
              <Text className="text-xs md:text-sm text-muted pt-2">
                من {statistics?.activitiesCount || 0} نشاط مسجل
              </Text>
            </View>

            {/* شبكة الإحصائيات */}
            <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <View className="bg-surface rounded-xl p-4 md:p-6 gap-2 border border-border">
                <Text className="text-xs text-muted">المتوسط اليومي</Text>
                <Text className="text-2xl md:text-3xl font-bold text-foreground">
                  {statistics?.averageDailyFootprint.toFixed(2) || "0"}
                </Text>
                <Text className="text-xs text-muted">kg CO2e</Text>
              </View>
              <View className="bg-surface rounded-xl p-4 md:p-6 gap-2 border border-border">
                <Text className="text-xs text-muted">هذا الأسبوع</Text>
                <Text className="text-2xl md:text-3xl font-bold text-foreground">
                  {statistics?.weeklyFootprint.toFixed(1) || "0"}
                </Text>
                <Text className="text-xs text-muted">kg CO2e</Text>
              </View>
              <View className="bg-surface rounded-xl p-4 md:p-6 gap-2 border border-border">
                <Text className="text-xs text-muted">هذا الشهر</Text>
                <Text className="text-2xl md:text-3xl font-bold text-foreground">
                  {statistics?.monthlyFootprint.toFixed(1) || "0"}
                </Text>
                <Text className="text-xs text-muted">kg CO2e</Text>
              </View>
              <View className="bg-surface rounded-xl p-4 md:p-6 gap-2 border border-border">
                <Text className="text-xs text-muted">هذه السنة</Text>
                <Text className="text-2xl md:text-3xl font-bold text-foreground">
                  {statistics?.yearlyFootprint.toFixed(1) || "0"}
                </Text>
                <Text className="text-xs text-muted">kg CO2e</Text>
              </View>
            </View>
          </View>

          {/* توزيع الفئات */}
          <View className="gap-3">
            <Text className="text-2xl font-bold text-foreground">توزيع حسب الفئة</Text>

            <View className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* القائمة */}
              <View className="bg-surface rounded-2xl p-6 border border-border gap-4">
                {Object.entries(categoryBreakdown).map(([category, value]) => {
                  const percentage = totalFootprint > 0 ? (value / totalFootprint) * 100 : 0;
                  return (
                    <View key={category} className="gap-2">
                      <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center gap-2 flex-1">
                          <View
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getCategoryColor(category) }}
                          />
                          <Text className="text-sm font-medium text-foreground">
                            {getCategoryLabel(category)}
                          </Text>
                        </View>
                        <Text className="text-sm font-bold text-foreground">{value.toFixed(1)} kg</Text>
                      </View>
                      <View className="h-2 bg-border rounded-full overflow-hidden">
                        <View
                          className="h-full rounded-full"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: getCategoryColor(category),
                          }}
                        />
                      </View>
                      <Text className="text-xs text-muted text-right">{percentage.toFixed(1)}%</Text>
                    </View>
                  );
                })}
              </View>

              {/* الإحصائيات الإضافية */}
              <View className="gap-4">
                <View className="bg-success/10 rounded-xl p-4 md:p-6 gap-2 border border-success/20">
                  <Text className="text-xs text-muted">التحديات المكتملة</Text>
                  <Text className="text-3xl md:text-4xl font-bold text-success">
                    {statistics?.challengesCompleted || 0}
                  </Text>
                </View>
                <View className="bg-primary/10 rounded-xl p-4 md:p-6 gap-2 border border-primary/20">
                  <Text className="text-xs text-muted">الشارات المفتوحة</Text>
                  <Text className="text-3xl md:text-4xl font-bold text-primary" style={{ color: colors.primary }}>
                    {statistics?.badgesUnlocked || 0}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* نصيحة */}
          <View className="bg-warning/10 rounded-xl p-4 md:p-6 gap-2 border border-warning/20">
            <Text className="text-base md:text-lg font-bold text-foreground">💡 نصيحة</Text>
            <Text className="text-sm md:text-base text-muted leading-relaxed">
              ركز على تقليل الأنشطة ذات أعلى انبعاثات لتحقيق أكبر تأثير بيئي إيجابي. بدء صغير
              يمكن أن يحدث فرقاً كبيراً على المدى الطويل.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
