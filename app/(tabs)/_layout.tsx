import { Tabs } from "expo-router";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function TabLayout() {
  const colors = useColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.foreground,
        headerShown: false,
        tabBarButton: HapticTab,
        // Hide tab bar - this app uses stack navigation
        tabBarStyle: {
          display: 'none',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Oracle",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="sparkles" color={color} />,
        }}
      />
    </Tabs>
  );
}
