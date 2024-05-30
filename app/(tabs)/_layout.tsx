import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "今月",
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "today" : "today-outline"} color={color} />,
        }}
      />
      <Tabs.Screen
        name="past-invoices"
        options={{
          title: "過去",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "calendar-number" : "calendar-number-outline"} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
