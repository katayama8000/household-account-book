import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { Tabs } from "expo-router";
import { useInvoice } from "../hooks/useInvoice";
import { useCouple } from "../hooks/useCouple";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAtom } from "jotai";
import { activeInvoiceAtom } from "../state/invoice.state";
import { ActivityIndicator } from "react-native";
import { coupleIdAtom } from "../state/couple.state";

export default function TabLayout() {
  const { fetchActiveInvoiceByCoupleId } = useInvoice();
  const [activeInvoice, setActiveInvoice] = useAtom(activeInvoiceAtom);
  const [coupleId] = useAtom(coupleIdAtom);

  useEffect(() => {
    (async () => {
      const userId = (await supabase.auth.getSession()).data.session?.user.id;
      if (!userId) {
        alert("userId is not found");
        return;
      }
      if (!coupleId) {
        alert("coupleId is not found");
        return;
      }
      const invoice = await fetchActiveInvoiceByCoupleId(coupleId);
      setActiveInvoice(invoice);
    })();
  }, [fetchActiveInvoiceByCoupleId, setActiveInvoice, coupleId]);
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
          title: `${activeInvoice === undefined ? <ActivityIndicator /> : activeInvoice?.month}月`,
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
