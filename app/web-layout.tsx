import { View } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { WebSidebar } from "@/components/web-sidebar";

interface WebLayoutProps {
  children: React.ReactNode;
}

export function WebLayout({ children }: WebLayoutProps) {
  const colors = useColors();

  return (
    <View
      className="flex-1 flex-row"
      style={{ backgroundColor: colors.background }}
    >
      {/* الشريط الجانبي - يظهر فقط على الويب */}
      <WebSidebar />

      {/* المحتوى الرئيسي */}
      <View className="flex-1 overflow-auto">
        {children}
      </View>
    </View>
  );
}
