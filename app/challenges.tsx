import { ScrollView, Text, View, Pressable, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { Challenge } from "@/lib/types";
import { getChallenges } from "@/lib/storage";

const SAMPLE_CHALLENGES: Challenge[] = [
  {
    id: "1",
    title: "استخدم المشي اليوم",
    description: "امشِ 5 كيلومترات بدلاً من استخدام السيارة",
    category: "transport" as any,
    target: 5,
    unit: "km",
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isCompleted: false,
    progress: 0,
    carbonSavings: 1.0,
  },
  {
    id: "2",
    title: "قلل استهلاك الكهرباء",
    description: "استخدم أقل من 10 كيلوواط/ساعة اليوم",
    category: "energy" as any,
    target: 10,
    unit: "kWh",
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isCompleted: false,
    progress: 0,
    carbonSavings: 5.0,
  },
  {
    id: "3",
    title: "تناول طعاماً نباتياً",
    description: "تناول وجبة نباتية واحدة على الأقل اليوم",
    category: "food" as any,
    target: 1,
    unit: "وجبة",
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isCompleted: false,
    progress: 0,
    carbonSavings: 2.5,
  },
];

export default function ChallengesScreen() {
  const colors = useColors();
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const saved = await getChallenges();
      if (saved.length === 0) {
        setChallenges(SAMPLE_CHALLENGES);
      } else {
        setChallenges(saved);
      }
    } catch (error) {
      console.error("Error loading challenges:", error);
      setChallenges(SAMPLE_CHALLENGES);
    } finally {
      setLoading(false);
    }
  };

  const handleChallengePress = (challenge: Challenge) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // يمكن إضافة شاشة تفاصيل التحدي هنا
  };

  const ChallengeCard = ({ item }: { item: Challenge }) => {
    const progressPercent = (item.progress / item.target) * 100;
    const isCompleted = item.isCompleted;

    return (
      <Pressable
        onPress={() => handleChallengePress(item)}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.7 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
        className="bg-surface rounded-2xl p-6 gap-4 mb-4 border border-border"
      >
        {/* رأس البطاقة */}
        <View className="flex-row justify-between items-start">
          <View className="flex-1 gap-1">
            <Text className="text-lg font-bold text-foreground">{item.title}</Text>
            <Text className="text-sm text-muted">{item.description}</Text>
          </View>
          {isCompleted && (
            <View className="bg-success/20 rounded-full px-3 py-1">
              <Text className="text-xs font-bold text-success">✓ مكتمل</Text>
            </View>
          )}
        </View>

        {/* شريط التقدم */}
        <View className="gap-2">
          <View className="flex-row justify-between items-center">
            <Text className="text-xs text-muted">
              {item.progress} / {item.target} {item.unit}
            </Text>
            <Text className="text-xs font-semibold text-primary" style={{ color: colors.primary }}>
              {Math.round(progressPercent)}%
            </Text>
          </View>
          <View className="h-2 bg-border rounded-full overflow-hidden">
            <View
              className="h-full bg-primary rounded-full"
              style={{
                width: `${Math.min(progressPercent, 100)}%`,
                backgroundColor: colors.primary,
              }}
            />
          </View>
        </View>

        {/* معلومات إضافية */}
        <View className="flex-row justify-between items-center pt-2 border-t border-border">
          <Text className="text-xs text-muted">
            {item.carbonSavings} kg CO2e توفير محتمل
          </Text>
          <Text className="text-xs text-muted">
            ينتهي في{" "}
            {new Date(item.endDate).toLocaleDateString("ar-SA", {
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* رأس الصفحة */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">🎯 التحديات</Text>
            <Text className="text-base text-muted">قبول التحديات وحقق إنجازات جديدة</Text>
          </View>

          {/* إحصائيات سريعة */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-primary/10 rounded-xl p-4 gap-1">
              <Text className="text-xs text-muted">التحديات النشطة</Text>
              <Text className="text-2xl font-bold text-primary" style={{ color: colors.primary }}>
                {challenges.filter((c) => !c.isCompleted).length}
              </Text>
            </View>
            <View className="flex-1 bg-success/10 rounded-xl p-4 gap-1">
              <Text className="text-xs text-muted">المكتملة</Text>
              <Text className="text-2xl font-bold text-success">
                {challenges.filter((c) => c.isCompleted).length}
              </Text>
            </View>
          </View>

          {/* قائمة التحديات */}
          <View className="gap-2">
            <Text className="text-lg font-bold text-foreground">التحديات المتاحة</Text>
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge.id} item={challenge} />
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
