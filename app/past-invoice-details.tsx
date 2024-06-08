import { supabase } from "@/lib/supabase";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import dayjs from "dayjs";
import { Colors } from "@/constants/Colors";
import type { Invoice, Payment } from "@/types/Row";

export default function PastInvoiceDetailsScreen() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const { id, date } = useLocalSearchParams();

  const getPaymentsByMonthlyInvoiceId = async (id: Invoice["id"]) => {
    const { data, error } = await supabase.from("dev_payments").select("*").eq("monthly_invoice_id", id);
    if (error) {
      console.error(error);
      return;
    }
    return data;
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    (async () => {
      if (typeof id === "string") {
        const data = await getPaymentsByMonthlyInvoiceId(Number(id));
        if (data) {
          setPayments(data);
        }
      }
    })();
  }, [id]);

  const renderItem = ({ item }: { item: Payment }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>入力日: {dayjs(item.updated_at).format("YYYY-MM-DD")}</Text>
      <Text style={styles.cardText}>項目: {item.name}</Text>
      <Text style={styles.cardText}>金額: {item.amount.toLocaleString()}円</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{date}</Text>
      {payments.length === 0 ? (
        <Text style={styles.noData}>支払い情報がありません。</Text>
      ) : (
        <FlatList
          data={payments}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: Colors.primary,
  },
  noData: {
    fontSize: 18,
    color: "#999",
    textAlign: "center",
    marginTop: 32,
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
    borderLeftWidth: 6,
    borderLeftColor: Colors.primary,
  },
  cardText: {
    fontSize: 18,
    color: "#444",
    marginBottom: 8,
  },
});
