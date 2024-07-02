import { Colors } from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import { defaultFontSize, defaultFontWeight, defaultShadowColor } from "@/style/defaultStyle";
import type { Couple, Invoice, Payment, Payment as PaymentRow } from "@/types/Row";
import { AntDesign } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import type { ExpoRouter } from "expo-router/types/expo-router";
import { useAtom } from "jotai";
import { type FC, useEffect, useState } from "react";
import { Alert, FlatList, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import packageJson from "../../package.json";
import { useCouple } from "../hooks/useCouple";
import { useInvoice } from "../hooks/useInvoice";
import { usePayment } from "../hooks/usePayment";
import { coupleIdAtom } from "../state/couple.state";
import { activeInvoiceAtom } from "../state/invoice.state";

const HomeScreen: FC = () => {
  const { payments, isRefreshing, deletePayment } = usePayment();
  const { addInvoice, unActiveInvoicesAll, turnInvoicePaid, fetchActiveInvoiceByCoupleId } = useInvoice();
  const { fetchCoupleIdByUserId } = useCouple();
  const { fetchPaymentsAllByMonthlyInvoiceId } = usePayment();
  const [coupleId, setCoupleId] = useAtom(coupleIdAtom);
  const [activeInvoce, setActiveInvoice] = useAtom(activeInvoiceAtom);
  const router = useRouter();
  const showCloseMonthButton = process.env.EXPO_PUBLIC_APP_ENV === "development" ? true : dayjs().date() >= 20;
  const [userId, setUserId] = useState<string | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    (async () => {
      const uid = (await supabase.auth.getSession())?.data.session?.user?.id;
      if (!uid) {
        router.push({ pathname: "/sign-in" });
        return;
      }
      setUserId(uid);

      const coupleId = await fetchCoupleIdByUserId(uid);
      if (!coupleId) {
        throw new Error("coupleId is not found");
      }
      setCoupleId(coupleId);

      const activeInvoiceData = await fetchActiveInvoiceByCoupleId(coupleId);
      setActiveInvoice(activeInvoiceData);
    })();
  }, []);

  const updateActiveInvoice = async () => {
    if (!coupleId) {
      alert("coupleId is not found");
      throw new Error("coupleId is not found");
    }
    const activeInvoiceData = await fetchActiveInvoiceByCoupleId(coupleId);
    setActiveInvoice(activeInvoiceData);
  };

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
        updateActiveInvoice={updateActiveInvoice}
        userId={userId}
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
  updateActiveInvoice: () => Promise<void>;
  userId: string | null;
};

const PaymentList: FC<PaymentListProps> = ({
  activeInvoiceId,
  payments,
  isRefreshing,
  fetchAllPaymentsByMonthlyInvoiceId,
  deletePayment,
  routerPush,
  updateActiveInvoice,
  userId,
}) => (
  <FlatList
    data={payments.sort((a, b) => b.id - a.id)}
    renderItem={({ item }) => (
      <PaymentItem payment={item} routerPush={routerPush} deletePayment={deletePayment} userId={userId} />
    )}
    keyExtractor={(item) => item.id.toString()}
    ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
    ListEmptyComponent={() => <Text style={styles.emptyListText}>支払いがまだありません</Text>}
    contentContainerStyle={{ paddingBottom: 12 }}
    onRefresh={async () => {
      if (activeInvoiceId === null) return;
      await updateActiveInvoice();
      fetchAllPaymentsByMonthlyInvoiceId(activeInvoiceId);
    }}
    refreshing={isRefreshing}
    ListFooterComponent={<GithubIssueLink />}
  />
);

const GithubIssueLink: FC = () => {
  return (
    <View style={styles.linkContainer}>
      <TouchableOpacity
        onPress={() => Linking.openURL("https://github.com/katayama8000/household-account-book/issues")}
      >
        <Text style={styles.link}>バグや要望はこちら</Text>
      </TouchableOpacity>
      <Text style={styles.version}>v{packageJson.version}</Text>
    </View>
  );
};

type PaymentItemProps = {
  deletePayment: (id: PaymentRow["id"]) => Promise<void>;
  routerPush: (href: ExpoRouter.Href) => void;
  payment: PaymentRow;
  userId: string | null;
};

const PaymentItem: FC<PaymentItemProps> = ({ deletePayment, routerPush, payment, userId }) => {
  const { fetchPaymentsAllByMonthlyInvoiceId } = usePayment();
  const [activeInvoce] = useAtom(activeInvoiceAtom);
  const isOwner = payment.owner_id === userId;
  return (
    <TouchableOpacity
      style={[
        styles.paymentContainer,
        {
          backgroundColor: isOwner ? Colors.white : Colors.gray,
        },
      ]}
      onPress={() => isOwner && routerPush({ pathname: "/payment-modal", params: { kind: "edit", id: payment.id } })}
    >
      <View style={styles.paymentInfoContainer}>
        <Text style={styles.itemTitle}>{payment.name}</Text>
        <View style={styles.row}>
          <Text style={styles.value}>{payment.amount.toLocaleString()}円</Text>
        </View>
      </View>
      {isOwner && (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() =>
            Alert.alert("削除します", "よろしいですか？", [
              { text: "いいえ", style: "cancel" },
              {
                text: "はい",
                onPress: async () => {
                  deletePayment(payment.id);
                  if (activeInvoce === null) return;
                  await fetchPaymentsAllByMonthlyInvoiceId(activeInvoce.id);
                },
              },
            ])
          }
        >
          <AntDesign name="delete" size={24} color="white" />
        </TouchableOpacity>
      )}
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
    fontWeight: defaultFontWeight,
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
    fontWeight: defaultFontWeight,
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
    fontWeight: defaultFontWeight,
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
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  link: {
    color: Colors.primary,
  },
  version: {
    color: Colors.black,
    paddingLeft: 8,
  },
});

export default HomeScreen;
