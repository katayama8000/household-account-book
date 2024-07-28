import { defaultFontSize, defaultFontWeight, defaultShadowColor } from "@/style/defaultStyle";
import type { Invoice } from "@/types/Row";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import type { ExpoRouter } from "expo-router/types/expo-router";
import { useAtom } from "jotai";
import { type FC, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useInvoice } from "../../hooks/useInvoice";
import { usePayment } from "../../hooks/usePayment";
import { coupleIdAtom } from "../../state/couple.state";
import { Colors } from "@/constants/Colors";
import type { InvoiceWithBalance } from "@/state/invoice.state";

const PastInvoicesScreen = () => {
  const { invoices, isRefreshing, fetchInvoicesWithBalancesByCoupleId } = useInvoice();
  const { push } = useRouter();
  const [coupleId] = useAtom(coupleIdAtom);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!coupleId) return;
    fetchInvoicesWithBalancesByCoupleId(coupleId);
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
        renderItem={({ item }) => <MonthlyInvoice invoiceWithBalance={item} routerPush={push} />}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        ListEmptyComponent={() => <Text>過去の請求がありません</Text>}
        contentContainerStyle={{ paddingBottom: 100 }}
        onRefresh={() => {
          if (coupleId === null) return;
          fetchInvoicesWithBalancesByCoupleId(coupleId);
        }}
        refreshing={isRefreshing}
      />
    </View>
  );
};

type MonthlyInvoiceProps = {
  invoiceWithBalance: InvoiceWithBalance;
  routerPush: (href: ExpoRouter.Href) => void;
};

const MonthlyInvoice: FC<MonthlyInvoiceProps> = ({ invoiceWithBalance, routerPush }) => {
  // const [balance, setBalance] = useState<number | null>(invoiceWithBalance.balance ?? null);
  // const [totalAmount, setTotalAmount] = useState<number | null>(null);
  // const { calculateInvoiceBalance } = usePayment();

  // useFocusEffect(
  //   useCallback(() => {
  //     let isMounted = true;
  //     (async () => {
  //       try {
  //         const amount = await calculateInvoiceBalance(invoiceWithBalance.id);
  //         if (isMounted) {
  //           setTotalAmount(amount);
  //         }
  //       } catch (error) {
  //         console.error("Error calculating invoice balance:", error);
  //         if (isMounted) {
  //           setTotalAmount(null);
  //         }
  //       }
  //     })();

  //     return () => {
  //       isMounted = false;
  //     };
  //   }, [invoiceWithBalance.id, calculateInvoiceBalance]),
  // );

  return (
    <TouchableOpacity
      style={[styles.card]}
      onPress={() =>
        routerPush({
          pathname: "/past-invoice-details",
          params: { id: invoiceWithBalance.id, date: `${invoiceWithBalance.year}年 ${invoiceWithBalance.month}月` },
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
            <Text style={styles.date}>{`${invoiceWithBalance.year}年 ${invoiceWithBalance.month}月`}</Text>
            {invoiceWithBalance.active && <Text style={styles.thisMonth}>今月</Text>}
          </View>
          <Text style={styles.amount}>
            {invoiceWithBalance.balance != null ? (
              invoiceWithBalance.balance > 0 ? (
                `${invoiceWithBalance.balance.toLocaleString()}円の受け取り`
              ) : (
                `${Math.abs(invoiceWithBalance.balance).toLocaleString()}円の支払い`
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
