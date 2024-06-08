import { useRouter } from "expo-router";
import type { ExpoRouter } from "expo-router/types/expo-router";
import { useEffect, useState, type FC } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FlatList } from "react-native";
import dayjs from "dayjs";
import { invoiceAtom } from "../state/invoice.state";
import { useAtom } from "jotai";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type Payment = Database["public"]["Tables"]["dev_payments"]["Row"];
type Invoice = Database["public"]["Tables"]["dev_monthly_invoices"]["Row"];

export default function PastInvoicesScreen() {
  const [invoices, setInvoices] = useAtom(invoiceAtom);
  const { push } = useRouter();

  const fetchInvoices = async () => {
    const { data, error } = await supabase.from("dev_monthly_invoices").select("*");

    if (error) {
      console.error(error);
      return;
    }
    return data;
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    (async () => {
      const invoices = await fetchInvoices();
      if (invoices) {
        setInvoices(invoices);
      }
    })();
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
        onRefresh={(): void => {
          // get items from server
          console.log("refresh");
        }}
        // set refreshing to true when loading items from server
        refreshing={false}
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
  const getTotalPayment = async (monthly_invoice_id: Payment["monthly_invoice_id"]) => {
    const { data, error } = await supabase
      .from("dev_payments")
      .select("amount")
      .eq("monthly_invoice_id", monthly_invoice_id);
    if (error) {
      console.error(error);
      throw error;
    }
    return data.reduce((acc, cur) => acc + cur.amount, 0);
  };

  useEffect(() => {
    (async () => {
      const totalAmount = await getTotalPayment(invoice.id);
      setTotalAmount(totalAmount);
    })();
  }, [invoice.id, getTotalPayment]);
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#4caf50",
        padding: 16,
        borderRadius: 8,
        margin: 8,
      }}
      onPress={() => {
        routerPush("/past-invoice-details");
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 24,
          marginBottom: 24,
        }}
      >
        {dayjs(invoice.created_at).format("YYYY-MM")}
      </Text>
      <Text
        style={{
          color: "white",
          fontSize: 24,
          marginBottom: 24,
        }}
      >
        {totalAmount}
      </Text>
    </TouchableOpacity>
  );
};
