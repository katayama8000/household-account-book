import { Colors } from "@/constants/Colors";
import { defaultFontSize, defaultShadowColor } from "@/style/defaultStyle";
import type { Couple, Invoice, Payment, Payment as PaymentRow } from "@/types/Row";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { ExpoRouter } from "expo-router/types/expo-router";
import type { FC } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useInvoice } from "../hooks/useInvoice";
import { usePayment } from "../hooks/usePayment";
import { coupleIdAtom } from "../state/couple.state";
import { useAtom } from "jotai";
import { activeInvoiceAtom } from "../state/invoice.state";

const HomeScreen: FC = () => {
  const { payments, isRefreshing, deletePayment } = usePayment();
  const { addInvoice, unActiveInvoicesAll, turnInvoicePaid, fetchActiveInvoiceByCoupleId } = useInvoice();
  const { fetchPaymentsAllByMonthlyInvoiceId } = usePayment();
  const [coupleId] = useAtom(coupleIdAtom);
  const [activeInvoce, setActiveInvoice] = useAtom(activeInvoiceAtom);
  const router = useRouter();
  const showCloseMonthButton = true;
  // dayjs().date() >= 25 || dayjs().date() <= 5;

  const handleCloseMonth = async (coupleId: Couple["id"]) => {
    Alert.alert("今月の精算を完了します", "よろしいですか？", [
      { text: "いいえ", style: "cancel" },
      {
        text: "はい",
        onPress: async () => {
          await unActiveInvoicesAll(coupleId);
          await turnInvoicePaid(coupleId);
          await addInvoice(coupleId);
          const activeInvoice = await fetchActiveInvoiceByCoupleId(coupleId);
          setActiveInvoice(activeInvoice);
          Alert.alert("精算が完了しました", "今月もパートナーを大事にね！");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonWrapper}>
        <AddPaymentButton onPress={() => router.push({ pathname: "/payment-modal", params: { kind: "add" } })} />
        {showCloseMonthButton && (
          <CloseMonthButton
            onPress={async () => {
              if (!coupleId) {
                alert("coupleId is not found");
                return;
              }
              handleCloseMonth(coupleId);
            }}
          />
        )}
      </View>
      <PaymentList
        activeInvoiceId={activeInvoce?.id ?? null}
        payments={payments}
        isRefreshing={isRefreshing}
        fetchAllPaymentsByMonthlyInvoiceId={fetchPaymentsAllByMonthlyInvoiceId}
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

type CloseMonthButtonProps = {
  onPress: () => void;
};

const CloseMonthButton: FC<CloseMonthButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.addButton} onPress={onPress}>
      <AntDesign name="checkcircleo" size={24} color="white" />
      <Text style={styles.addButtonText}>締める</Text>
    </TouchableOpacity>
  );
};

type PaymentListProps = {
  activeInvoiceId: Invoice["id"] | null;
  payments: PaymentRow[];
  isRefreshing: boolean;
  fetchAllPaymentsByMonthlyInvoiceId: (id: Payment["monthly_invoice_id"]) => void;
  deletePayment: (id: PaymentRow["id"]) => Promise<void>;
  routerPush: (href: ExpoRouter.Href) => void;
};

const PaymentList: FC<PaymentListProps> = ({
  activeInvoiceId,
  payments,
  isRefreshing,
  fetchAllPaymentsByMonthlyInvoiceId,
  deletePayment,
  routerPush,
}) => (
  <FlatList
    data={payments.sort((a, b) => b.id - a.id)}
    renderItem={({ item }) => <PaymentItem payment={item} routerPush={routerPush} deletePayment={deletePayment} />}
    keyExtractor={(item) => item.id.toString()}
    ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
    ListEmptyComponent={() => <Text style={styles.emptyListText}>支払いがまだありません</Text>}
    contentContainerStyle={{ paddingBottom: 100 }}
    onRefresh={() => {
      if (activeInvoiceId === null) {
        return;
      }
      fetchAllPaymentsByMonthlyInvoiceId(activeInvoiceId);
    }}
    refreshing={isRefreshing}
  />
);

type PaymentItemProps = {
  deletePayment: (id: PaymentRow["id"]) => Promise<void>;
  routerPush: (href: ExpoRouter.Href) => void;
  payment: PaymentRow;
};

const PaymentItem: FC<PaymentItemProps> = ({ deletePayment, routerPush, payment }) => {
  const { fetchPaymentsAllByMonthlyInvoiceId } = usePayment();
  const [activeInvoce] = useAtom(activeInvoiceAtom);
  return (
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
            {
              text: "はい",
              onPress: async () => {
                deletePayment(payment.id);
                if (activeInvoce === null) {
                  return;
                }
                await fetchPaymentsAllByMonthlyInvoiceId(activeInvoce.id);
              },
            },
          ])
        }
      >
        <AntDesign name="delete" size={24} color="white" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
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
