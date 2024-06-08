import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import type { FC } from "react";
import type { Payment as PaymentRow } from "@/types/Row";
import type { ExpoRouter } from "expo-router/types/expo-router";
import { usePayment } from "../hooks/usePayment";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const { payments, isRefreshing, fetchAllPayments, deletePayment } = usePayment();
  const { push } = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Home Screen</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          push({
            pathname: "/payment-modal",
            params: { kind: "add" },
          })
        }
      >
        <AntDesign name="pluscircleo" size={24} color="white" />
        <Text style={styles.addButtonText}>追加</Text>
      </TouchableOpacity>

      <FlatList
        data={payments.sort((a, b) => b.id - a.id)}
        renderItem={({ item }) => <Payment payment={item} routerPush={push} deletePayment={deletePayment} />}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        ListEmptyComponent={() => <Text style={styles.emptyListText}>No items</Text>}
        contentContainerStyle={{ paddingBottom: 100 }}
        onRefresh={fetchAllPayments}
        refreshing={isRefreshing}
      />
    </View>
  );
}

type PaymentProps = {
  deletePayment: (id: number) => Promise<void>;
  routerPush: (href: ExpoRouter.Href) => void;
  payment: PaymentRow;
};

const Payment: FC<PaymentProps> = ({ deletePayment, routerPush, payment }) => {
  return (
    <TouchableOpacity style={styles.paymentContainer}>
      <View style={styles.paymentInfoContainer}>
        <Text style={styles.itemTitle}>{payment.name}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>金額:</Text>
          <Text style={styles.value}>{payment.amount}円</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() =>
            routerPush({
              pathname: "/payment-modal",
              params: {
                kind: "edit",
                id: payment.id,
              },
            })
          }
        >
          <AntDesign name="edit" size={16} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
              { text: "Cancel", style: "cancel" },
              {
                text: "OK",
                onPress: () => {
                  deletePayment(payment.id);
                },
              },
            ]);
          }}
        >
          <AntDesign name="delete" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#282c34",
    padding: 16,
  },
  headerText: {
    color: "white",
    fontSize: 24,
    marginBottom: 24,
  },
  addButton: {
    borderRadius: 50,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    width: 100,
    padding: 8,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    paddingHorizontal: 8,
  },
  emptyListText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  paymentContainer: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  paymentInfoContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: "#888",
  },
  value: {
    fontSize: 14,
    fontWeight: "bold",
  },
  actions: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 32,
    height: 32,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
  },
});
