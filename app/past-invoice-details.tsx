import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import dayjs from "dayjs";
import { Colors } from "@/constants/Colors";
import type { Payment } from "@/types/Row";
import { usePayment } from "./hooks/usePayment";
import { defaultFontSize } from "@/style/defaultStyle";

export default function PastInvoiceDetailsScreen() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const { id, date } = useLocalSearchParams();
  const { getPaymentsByMonthlyInvoiceId } = usePayment();
  const { setOptions } = useNavigation();
  useEffect(() => {
    if (typeof date === "string") {
      setOptions({ headerTitle: date });
    }
  }, [date, setOptions]);

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
      <Text style={styles.cardText}>入力日：{dayjs(item.updated_at).format("YYYY年MM月DD日")}</Text>
      <Text style={styles.cardText}>項目：{item.name}</Text>
      <Text style={styles.cardText}>金額：{item.amount.toLocaleString()}円</Text>
    </View>
  );

  return (
    <View style={styles.container}>
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
  noData: {
    fontSize: defaultFontSize,
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
    fontSize: defaultFontSize,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 8,
  },
});
