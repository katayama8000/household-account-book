import { defaultFontSize, defaultFontWeight, defaultShadowColor } from "@/style/defaultStyle";
import type { Invoice } from "@/types/Row";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { ExpoRouter } from "expo-router/types/expo-router";
import { type FC, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useInvoice } from "../hooks/useInvoice";
import { usePayment } from "../hooks/usePayment";
import { coupleIdAtom } from "../state/couple.state";
import { useAtom } from "jotai";

const PastInvoicesScreen = () => {
  const { invoices, isRefreshing, fetchInvoicesAllByCoupleId } = useInvoice();
  const { push } = useRouter();
  const [coupleId] = useAtom(coupleIdAtom);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!coupleId) return;
    fetchInvoicesAllByCoupleId(coupleId);
  }, []);

  return (
    <View
      style={{
        marginTop: 16,
        paddingHorizontal: 16,
      }}
    >
      <FlatList
        data={invoices}
        renderItem={({ item }) => <MonthlyInvoice invoice={item} routerPush={push} />}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        ListEmptyComponent={() => <Text>No items</Text>}
        contentContainerStyle={{ paddingBottom: 100 }}
        onRefresh={() => {
          if (!coupleId) return;
          fetchInvoicesAllByCoupleId(coupleId);
        }}
        refreshing={isRefreshing}
      />
    </View>
  );
};

type MonthlyInvoiceProps = {
  invoice: Invoice;
  routerPush: (href: ExpoRouter.Href) => void;
};

const MonthlyInvoice: FC<MonthlyInvoiceProps> = ({ invoice, routerPush }) => {
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const { fetchPaymentTotal } = usePayment();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const fetchData = async () => {
      const totalAmount = await fetchPaymentTotal(invoice.id);
      setTotalAmount(totalAmount);
    };
    fetchData();
  }, []);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        routerPush({
          pathname: "/past-invoice-details",
          params: { id: invoice.id, date: `${invoice.year}年 ${invoice.month}月` },
        })
      }
    >
      <View style={styles.container}>
        <View style={{}}>
          <Text style={styles.date}>{`${invoice.year}年 ${invoice.month}月`}</Text>
          <Text style={styles.amount}>
            {totalAmount !== null ? `${totalAmount.toLocaleString()}円` : <ActivityIndicator color="#fff" />}
          </Text>
        </View>
        <MaterialIcons name="arrow-forward-ios" size={24} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: defaultShadowColor,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: "white",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: defaultFontSize,
    fontWeight: defaultFontWeight,
    marginBottom: 4,
  },
  amount: {
    fontSize: defaultFontSize,
    fontWeight: defaultFontWeight,
  },
});

export default PastInvoicesScreen;
