import { ScrollView, Text, View, Pressable, Alert, Switch } from "react-native";
import { useEffect, useState } from "react";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { UserStatistics, UserPreferences } from "@/lib/types";
import { calculateStatistics, getPreferences, savePreferences, clearAllData } from "@/lib/storage";

export default function ProfileScreen() {
  const colors = useColors();
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    unit: "metric",
    language: "ar",
    notifications: true,
    darkMode: false,
    theme: "auto",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const stats = await calculateStatistics();
      setStatistics(stats);

      const prefs = await getPreferences();
      setPreferences(prefs);
    } catch (error) {
      console.error("Error loading profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = async (key: keyof UserPreferences, value: any) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    await savePreferences(updated);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleClearData = () => {
    Alert.alert("تأكيد", "هل أنت متأكد من حذف جميع البيانات؟", [
      { text: "إلغاء", onPress: () => {}, style: "cancel" },
      {
        text: "حذف",
        onPress: async () => {
          try {
            await clearAllData();
            Alert.alert("نجاح", "تم حذف جميع البيانات");
            loadData();
          } catch (error) {
            Alert.alert("خطأ", "حدث خطأ أثناء حذف البيانات");
          }
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* رأس الصفحة */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">👤 الملف الشخصي</Text>
            <Text className="text-base text-muted">إدارة حسابك والإعدادات</Text>
          </View>

          {/* معلومات المستخدم */}
          <View className="bg-surface rounded-2xl p-6 gap-4 border border-border">
            <View className="items-center gap-3">
              <View
                className="w-16 h-16 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-3xl">🌍</Text>
              </View>
              <View className="items-center gap-1">
                <Text className="text-xl font-bold text-foreground">مستخدم EcoSphere</Text>
                <Text className="text-sm text-muted">عضو منذ اليوم</Text>
              </View>
            </View>
          </View>

          {/* الإحصائيات الشاملة */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">الإحصائيات الشاملة</Text>

            <View className="grid grid-cols-2 gap-3">
              <View className="bg-surface rounded-xl p-4 gap-2 border border-border">
                <Text className="text-xs text-muted">إجمالي الأنشطة</Text>
                <Text className="text-2xl font-bold text-foreground">
                  {statistics?.activitiesCount || 0}
                </Text>
              </View>
              <View className="bg-surface rounded-xl p-4 gap-2 border border-border">
                <Text className="text-xs text-muted">التحديات المكتملة</Text>
                <Text className="text-2xl font-bold text-foreground">
                  {statistics?.challengesCompleted || 0}
                </Text>
              </View>
              <View className="bg-surface rounded-xl p-4 gap-2 border border-border">
                <Text className="text-xs text-muted">الشارات المفتوحة</Text>
                <Text className="text-2xl font-bold text-foreground">
                  {statistics?.badgesUnlocked || 0}
                </Text>
              </View>
              <View className="bg-surface rounded-xl p-4 gap-2 border border-border">
                <Text className="text-xs text-muted">أفضل سلسلة</Text>
                <Text className="text-2xl font-bold text-foreground">
                  {statistics?.bestStreak || 0} يوم
                </Text>
              </View>
            </View>
          </View>

          {/* الإعدادات */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">الإعدادات</Text>

            {/* الإشعارات */}
            <View className="bg-surface rounded-xl p-4 flex-row justify-between items-center border border-border">
              <View className="gap-1">
                <Text className="font-semibold text-foreground">الإشعارات</Text>
                <Text className="text-xs text-muted">تنبيهات التحديات والنصائح</Text>
              </View>
              <Switch
                value={preferences.notifications}
                onValueChange={(value) => handlePreferenceChange("notifications", value)}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>

            {/* الوحدات */}
            <View className="bg-surface rounded-xl p-4 gap-3 border border-border">
              <Text className="font-semibold text-foreground">الوحدات</Text>
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => handlePreferenceChange("unit", "metric")}
                  className={`flex-1 rounded-lg p-3 items-center ${
                    preferences.unit === "metric" ? "bg-primary" : "bg-border/20"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      preferences.unit === "metric" ? "text-white" : "text-foreground"
                    }`}
                  >
                    متري
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => handlePreferenceChange("unit", "imperial")}
                  className={`flex-1 rounded-lg p-3 items-center ${
                    preferences.unit === "imperial" ? "bg-primary" : "bg-border/20"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      preferences.unit === "imperial" ? "text-white" : "text-foreground"
                    }`}
                  >
                    إمبراطوري
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* اللغة */}
            <View className="bg-surface rounded-xl p-4 gap-3 border border-border">
              <Text className="font-semibold text-foreground">اللغة</Text>
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => handlePreferenceChange("language", "ar")}
                  className={`flex-1 rounded-lg p-3 items-center ${
                    preferences.language === "ar" ? "bg-primary" : "bg-border/20"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      preferences.language === "ar" ? "text-white" : "text-foreground"
                    }`}
                  >
                    العربية
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => handlePreferenceChange("language", "en")}
                  className={`flex-1 rounded-lg p-3 items-center ${
                    preferences.language === "en" ? "bg-primary" : "bg-border/20"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      preferences.language === "en" ? "text-white" : "text-foreground"
                    }`}
                  >
                    English
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* الخطر */}
          <View className="gap-3">
            <Pressable
              onPress={handleClearData}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              className="bg-error/10 rounded-xl p-4 items-center border border-error/20"
            >
              <Text className="text-sm font-bold text-error">حذف جميع البيانات</Text>
            </Pressable>
          </View>

          {/* معلومات التطبيق */}
          <View className="bg-surface rounded-xl p-4 gap-2 border border-border items-center">
            <Text className="text-sm text-muted">EcoSphere v1.0.0</Text>
            <Text className="text-xs text-muted">تطبيق إدارة الاستدامة الشخصية</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
