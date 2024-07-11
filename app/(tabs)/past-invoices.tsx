import { defaultFontSize, defaultFontWeight, defaultShadowColor } from "@/style/defaultStyle";
import type { Invoice } from "@/types/Row";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { ExpoRouter } from "expo-router/types/expo-router";
import { useAtom } from "jotai";
import { type FC, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useInvoice } from "../../hooks/useInvoice";
import { usePayment } from "../../hooks/usePayment";
import { coupleIdAtom } from "../../state/couple.state";
import { Colors } from "@/constants/Colors";

const PastInvoicesScreen = () => {
  const { invoices, isRefreshing, fetchInvoicesAllByCoupleId } = useInvoice();
  const { push } = useRouter();
  const [coupleId] = useAtom(coupleIdAtom);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!coupleId) return;
    fetchInvoicesAllByCoupleId(coupleId);
  }, [coupleId]);

  return (
    <View
      style={{
        marginTop: 16,
        paddingHorizontal: 16,
      }}
    >
      <FlatList
        data={invoices.sort((a, b) => {
          if (a.year === b.year) {
            return b.month - a.month;
          }
          return b.year - a.year;
        })}
        renderItem={({ item }) => <MonthlyInvoice invoice={item} routerPush={push} />}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        ListEmptyComponent={() => <Text>過去の請求がありません</Text>}
        contentContainerStyle={{ paddingBottom: 100 }}
        onRefresh={() => {
          if (coupleId === null) return;
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
  const { calculateInvoiceBalance } = usePayment();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    (async () => {
      const totalAmount = await calculateInvoiceBalance(invoice.id);
      setTotalAmount(totalAmount);
    })();
  }, [invoice]);

  return (
    <TouchableOpacity
      style={[styles.card]}
      onPress={() =>
        routerPush({
          pathname: "/past-invoice-details",
          params: { id: invoice.id, date: `${invoice.year}年 ${invoice.month}月` },
        })
      }
    >
      <View style={styles.container}>
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Text style={styles.date}>{`${invoice.year}年 ${invoice.month}月`}</Text>
            {invoice.active && <Text style={styles.thisMonth}>今月</Text>}
          </View>
          <Text style={styles.amount}>
            {totalAmount !== null ? (
              totalAmount > 0 ? (
                `${totalAmount.toLocaleString()}円の受け取り`
              ) : (
                `${Math.abs(totalAmount).toLocaleString()}円の支払い`
              )
            ) : (
              <ActivityIndicator color={Colors.primary} />
            )}
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
  thisMonth: {
    padding: 4,
    paddingHorizontal: 8,
    backgroundColor: "#FFD700",
    borderRadius: 16,
    color: "#fff",
    fontSize: 12,
    fontWeight: "light",
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
