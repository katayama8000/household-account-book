import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useEffect, type FC } from "react";
import type { Payment as PaymentRow } from "@/types/Row";
import { usePayment } from "../hooks/usePayment";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import type { ExpoRouter } from "expo-router/types/expo-router";
import { defaultFontSize, defaultShadowColor } from "@/style/defaultStyle";
import { supabase } from "@/lib/supabase";

const HomeScreen: FC = () => {
  const { payments, isRefreshing, fetchAllPayments, deletePayment } = usePayment();
  const router = useRouter();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const f = async () => {
      const user = await supabase.auth.getUser();
      console.log(user);
      if (user.data.user === null) {
        router.push({ pathname: "/sign-in" });
      }
    };
    f();
  }, []);

  return (
    <View style={styles.container}>
      <AddPaymentButton onPress={() => router.push({ pathname: "/payment-modal", params: { kind: "add" } })} />
      <PaymentList
        payments={payments}
        isRefreshing={isRefreshing}
        fetchAllPayments={fetchAllPayments}
        deletePayment={deletePayment}
        routerPush={router.push}
      />
    </View>
  );
};

type AddPaymentButtonProps = {
  onPress: () => void;
};

const AddPaymentButton: FC<AddPaymentButtonProps> = ({ onPress }) => (
  <TouchableOpacity style={styles.addButton} onPress={onPress}>
    <AntDesign name="pluscircleo" size={24} color="white" />
    <Text style={styles.addButtonText}>追加</Text>
  </TouchableOpacity>
);

type PaymentListProps = {
  payments: PaymentRow[];
  isRefreshing: boolean;
  fetchAllPayments: () => void;
  deletePayment: (id: PaymentRow["id"]) => Promise<void>;
  routerPush: (href: ExpoRouter.Href) => void;
};

const PaymentList: FC<PaymentListProps> = ({ payments, isRefreshing, fetchAllPayments, deletePayment, routerPush }) => (
  <FlatList
    data={payments.sort((a, b) => b.id - a.id)}
    renderItem={({ item }) => <PaymentItem payment={item} routerPush={routerPush} deletePayment={deletePayment} />}
    keyExtractor={(item) => item.id.toString()}
    ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
    ListEmptyComponent={() => <Text style={styles.emptyListText}>No items</Text>}
    contentContainerStyle={{ paddingBottom: 100 }}
    onRefresh={fetchAllPayments}
    refreshing={isRefreshing}
  />
);

type PaymentItemProps = {
  deletePayment: (id: PaymentRow["id"]) => Promise<void>;
  routerPush: (href: ExpoRouter.Href) => void;
  payment: PaymentRow;
};

const PaymentItem: FC<PaymentItemProps> = ({ deletePayment, routerPush, payment }) => (
  <TouchableOpacity
    style={styles.paymentContainer}
    onPress={() => routerPush({ pathname: "/payment-modal", params: { kind: "edit", id: payment.id } })}
  >
    <View style={styles.paymentInfoContainer}>
      <Text style={styles.itemTitle}>{payment.name}</Text>
      <View style={styles.row}>
        <Text style={styles.value}>{payment.amount.toLocaleString()}円</Text>
      </View>
    </View>
    <TouchableOpacity
      style={styles.iconButton}
      onPress={() =>
        Alert.alert("削除します", "よろしいですか？", [
          { text: "いいえ", style: "cancel" },
          { text: "はい", onPress: () => deletePayment(payment.id) },
        ])
      }
    >
      <AntDesign name="delete" size={24} color="white" />
    </TouchableOpacity>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  addButton: {
    borderRadius: 50,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    width: 100,
    padding: 8,
    elevation: 4,
    shadowColor: defaultShadowColor,
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addButtonText: {
    color: "white",
    fontSize: defaultFontSize,
    paddingLeft: 8,
    fontWeight: "bold",
  },
  emptyListText: {
    color: "#888",
    fontSize: defaultFontSize,
    textAlign: "center",
  },
  paymentContainer: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
    shadowColor: defaultShadowColor,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
  },
  paymentInfoContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  iconButton: {
    width: 36,
    height: 36,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
  },
});

export default HomeScreen;
