import { ScrollView, Text, View, TextInput, Pressable, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { ActivityCategory, TransportType } from "@/lib/types";
import { calculateCarbonFootprint } from "@/lib/carbon-calculator";
import { saveActivity, calculateStatistics, saveStatistics } from "@/lib/storage";

export default function ActivityLoggerScreen() {
  const colors = useColors();
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: string }>();
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [carbonFootprint, setCarbonFootprint] = useState(0);

  const handleValueChange = (text: string) => {
    setValue(text);
    const numValue = parseFloat(text) || 0;
    const emissions = calculateCarbonFootprint(
      (category as ActivityCategory) || ActivityCategory.OTHER,
      numValue,
      TransportType.CAR
    );
    setCarbonFootprint(emissions);
  };

  const handleSave = async () => {
    if (!value || parseFloat(value) <= 0) {
      Alert.alert("خطأ", "الرجاء إدخال قيمة صحيحة");
      return;
    }

    try {
      setLoading(true);
      const activity = {
        id: Date.now().toString(),
        category: (category as ActivityCategory) || ActivityCategory.OTHER,
        date: new Date(),
        value: parseFloat(value),
        unit: category === "transport" ? "km" : "kg",
        carbonFootprint,
        description,
        type: TransportType.CAR,
      };

      await saveActivity(activity);
      const stats = await calculateStatistics();
      await saveStatistics(stats);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("نجاح", "تم تسجيل النشاط بنجاح");
      router.back();
    } catch (error) {
      console.error("Error saving activity:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء حفظ النشاط");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = () => {
    const labels: Record<string, string> = {
      transport: "النقل",
      energy: "الطاقة",
      food: "الغذاء",
      waste: "النفايات",
    };
    return labels[category as string] || "نشاط";
  };

  const getUnitLabel = () => {
    const units: Record<string, string> = {
      transport: "كيلومتر",
      energy: "كيلوواط/ساعة",
      food: "كيلوغرام",
      waste: "كيلوغرام",
    };
    return units[category as string] || "وحدة";
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* رأس الصفحة */}
          <View className="gap-2">
            <Pressable onPress={() => router.back()}>
              <Text className="text-lg text-primary" style={{ color: colors.primary }}>
                ← رجوع
              </Text>
            </Pressable>
            <Text className="text-3xl font-bold text-foreground">تسجيل نشاط</Text>
            <Text className="text-base text-muted">{getCategoryLabel()}</Text>
          </View>

          {/* نموذج الإدخال */}
          <View className="gap-4">
            {/* حقل القيمة */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">القيمة ({getUnitLabel()})</Text>
              <TextInput
                className="bg-surface border border-border rounded-xl p-4 text-foreground text-lg"
                placeholder="أدخل القيمة"
                placeholderTextColor={colors.muted}
                keyboardType="decimal-pad"
                value={value}
                onChangeText={handleValueChange}
              />
            </View>

            {/* حقل الوصف */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">الوصف (اختياري)</Text>
              <TextInput
                className="bg-surface border border-border rounded-xl p-4 text-foreground"
                placeholder="أضف وصفاً لهذا النشاط"
                placeholderTextColor={colors.muted}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* عرض البصمة الكربونية المحسوبة */}
            {carbonFootprint > 0 && (
              <View className="bg-primary/10 rounded-xl p-4 gap-2">
                <Text className="text-sm text-muted">البصمة الكربونية المقدرة</Text>
                <View className="flex-row items-baseline gap-2">
                  <Text className="text-3xl font-bold text-primary" style={{ color: colors.primary }}>
                    {carbonFootprint.toFixed(2)}
                  </Text>
                  <Text className="text-lg text-muted">kg CO2e</Text>
                </View>
              </View>
            )}

            {/* زر الحفظ */}
            <Pressable
              onPress={handleSave}
              disabled={loading}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
              className="bg-primary rounded-xl p-4 items-center justify-center mt-4"
            >
              <Text className="text-lg font-bold text-white">
                {loading ? "جاري الحفظ..." : "حفظ النشاط"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
