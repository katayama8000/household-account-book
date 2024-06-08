import { useRouter } from "expo-router";
import { useEffect, useState, type FC } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import dayjs from "dayjs";
import { invoiceAtom } from "../state/invoice.state";
import { useAtom } from "jotai";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";
import { MaterialIcons } from "@expo/vector-icons";
import type { ExpoRouter } from "expo-router/types/expo-router";
import { Colors } from "@/constants/Colors";

type Payment = Database["public"]["Tables"]["dev_payments"]["Row"];
type Invoice = Database["public"]["Tables"]["dev_monthly_invoices"]["Row"];

export default function PastInvoicesScreen() {
  const [invoices, setInvoices] = useAtom(invoiceAtom);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const { push } = useRouter();

  const fetchInvoices = async () => {
    setIsRefreshing(true);
    const { data, error } = await supabase.from("dev_monthly_invoices").select("*");

    if (error) {
      console.error(error);
      return;
    }
    if (data) {
      setInvoices(data);
    }
    setIsRefreshing(false);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <View>
      <Text>Past Screen</Text>
      <FlatList
        data={invoices}
        renderItem={({ item }) => <MonthlyInvoice invoice={item} routerPush={push} />}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        ListEmptyComponent={() => <Text>No items</Text>}
        contentContainerStyle={{ paddingBottom: 100 }}
        onRefresh={async (): Promise<void> => {
          await fetchInvoices();
        }}
        refreshing={isRefreshing}
      />
    </View>
  );
}

type MonthlyInvoiceProps = {
  invoice: Invoice;
  routerPush: (href: ExpoRouter.Href) => void;
};

const MonthlyInvoice: FC<MonthlyInvoiceProps> = ({ invoice, routerPush }) => {
  const [totalAmount, setTotalAmount] = useState<number | null>(null);

  useEffect(() => {
    const getTotalPayment = async (monthly_invoice_id: Payment["monthly_invoice_id"]) => {
      const { data, error } = await supabase
        .from("dev_payments")
        .select("amount")
        .eq("monthly_invoice_id", monthly_invoice_id);
      if (error) {
        console.error(error);
        return 0;
      }
      return data.reduce((acc, cur) => acc + cur.amount, 0);
    };

    (async () => {
      const totalAmount = await getTotalPayment(invoice.id);
      setTotalAmount(totalAmount);
    })();
  }, [invoice.id]);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        routerPush({
          pathname: "/past-invoice-details",
          params: { id: invoice.id, date: dayjs(invoice.created_at).format("YYYY-MM") },
        })
      }
      activeOpacity={0.8}
    >
      <View style={styles.container}>
        <Text style={styles.date}>{dayjs(invoice.created_at).format("YYYY-MM")}</Text>
        <Text style={styles.amount}>
          {totalAmount !== null ? `¥${totalAmount.toLocaleString()}` : <ActivityIndicator color="#fff" />}
        </Text>
        <MaterialIcons name="arrow-forward-ios" size={24} color="#fff" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    margin: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  amount: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});
