import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import dayjs from "dayjs";
import { Tabs } from "expo-router";
import { useInvoice } from "../hooks/useInvoice";
import { useCouple } from "../hooks/useCouple";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TabLayout() {
  const { fetchCoupleIdByUserId } = useCouple();
  const { fetchActiveInvoiceByCoupleId } = useInvoice();
  const [month, setMonth] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const userId = (await supabase.auth.getSession()).data.session?.user.id;
      if (!userId) {
        alert("userId is not found");
        return;
      }
      const coupleId = await fetchCoupleIdByUserId(userId);
      if (!coupleId) {
        alert("coupleId is not found");
        return;
      }
      const invoice = await fetchActiveInvoiceByCoupleId(coupleId);
      setMonth(invoice.month);
    })();
  }, [fetchActiveInvoiceByCoupleId, fetchCoupleIdByUserId]);
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
          title: `${month}月`,
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
