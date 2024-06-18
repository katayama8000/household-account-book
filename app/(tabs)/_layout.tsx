import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { Tabs } from "expo-router";
import { useAtom } from "jotai";
import { activeInvoiceAtom } from "../state/invoice.state";

export default function TabLayout() {
  const [activeInvoice] = useAtom(activeInvoiceAtom);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: activeInvoice === undefined ? "...loading" : `${activeInvoice?.month}月`,
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
