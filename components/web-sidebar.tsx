import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "./ui/icon-symbol";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "الرئيسية", href: "/", icon: "house.fill" },
  { label: "الإحصائيات", href: "/analytics", icon: "chart.bar.fill" },
  { label: "التحديات", href: "/challenges", icon: "target" },
  { label: "الملف الشخصي", href: "/profile", icon: "person.fill" },
];

export function WebSidebar() {
  const colors = useColors();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View
      className="hidden lg:flex w-64 bg-surface border-r border-border flex-col"
      style={{ backgroundColor: colors.surface }}
    >
      {/* الرأس */}
      <View className="p-6 border-b border-border gap-2">
        <Text className="text-2xl font-bold text-foreground">🌍 EcoSphere</Text>
        <Text className="text-xs text-muted">إدارة الاستدامة الشخصية</Text>
      </View>

      {/* قائمة الملاحة */}
      <ScrollView className="flex-1 p-4">
        <View className="gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href === "/" && pathname === "/(tabs)");
            return (
              <Pressable
                key={item.href}
                onPress={() => router.push(item.href as any)}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                className={`flex-row items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-primary" : "bg-transparent"
                }`}
              >
                <IconSymbol
                  name={item.icon as any}
                  size={24}
                  color={isActive ? "#FFFFFF" : colors.foreground}
                />
                <Text
                  className={`font-medium ${isActive ? "text-white" : "text-foreground"}`}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* الفوتر */}
      <View className="p-4 border-t border-border gap-2">
        <Text className="text-xs text-muted text-center">EcoSphere v1.0.0</Text>
        <Text className="text-xs text-muted text-center">
          © 2026 جميع الحقوق محفوظة
        </Text>
      </View>
    </View>
  );
}
