import { dev_payments } from "@/constants/Table";
import { supabase } from "@/lib/supabase";
import type { Payment } from "@/types/Row";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { ToastAndroid } from "react-native";
import { coupleIdAtom } from "../state/couple.state";
import { activeInvoiceAtom } from "../state/invoice.state";
import { paymentsAtom } from "../state/payment.state";
import { useInvoice } from "./useInvoice";

export const usePayment = () => {
  const [payments, setPayments] = useAtom(paymentsAtom);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [name, setName] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const { fetchInvoiceByCoupleId } = useInvoice();
  const [coupleId] = useAtom(coupleIdAtom);
  const { back } = useRouter();
  const [activeInvoice] = useAtom(activeInvoiceAtom);

  useEffect(() => {
    if (activeInvoice === null) {
      return;
    }
    fetchPaymentsAllByMonthlyInvoiceId(activeInvoice.id);
  }, [activeInvoice]);

  const resetForm = () => {
    setName(null);
    setAmount(null);
  };

  const addPayment = useCallback(async (): Promise<void> => {
    if (!name || !amount) {
      alert("Please enter both name and amount.");
      return;
    }

    if (!coupleId) {
      alert("coupleId is not found");
      return;
    }
    const monthly_invoice_id = (await fetchInvoiceByCoupleId(coupleId))?.id;

    if (monthly_invoice_id === undefined) {
      alert("monthly_invoice_id is not found");
      return;
    }

    const uid = (await supabase.auth.getSession())?.data.session?.user.id;
    if (uid === undefined) {
      alert("uid is not found");
      return;
    }
    try {
      const { error } = await supabase.from(dev_payments).insert([
        {
          amount,
          monthly_invoice_id,
          name,
          updated_at: dayjs().toISOString(),
          created_at: dayjs().toISOString(),
          owner_id: uid,
        },
      ]);

      if (error) {
        console.error(error);
        alert("An error occurred. Please try again.");
        return;
      }

      ToastAndroid.show("投稿した", ToastAndroid.SHORT);
      resetForm();
      back();
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    }
  }, [name, amount, back, resetForm, fetchInvoiceByCoupleId, coupleId]);

  const fetchPaymentsAllByMonthlyInvoiceId = useCallback(
    async (monthlyInvoiceId: Payment["monthly_invoice_id"]) => {
      setIsRefreshing(true);
      try {
        const { data, error } = await supabase
          .from(dev_payments)
          .select("*")
          .eq("monthly_invoice_id", monthlyInvoiceId);
        if (error) {
          console.error(error);
          alert("An error occurred. Please try again.");
          return;
        }
        if (data) {
          setPayments(data);
        }
        return data;
      } catch (error) {
        console.error(error);
        alert("An error occurred. Please try again.");
      } finally {
        setIsRefreshing(false);
      }
    },
    [setPayments],
  );

  const updatePayment = useCallback(
    async (id: Payment["id"], payment: Pick<Payment, "name" | "amount">): Promise<void> => {
      try {
        const { error } = await supabase.from(dev_payments).update(payment).match({ id });
        if (error) {
          console.error(error);
          alert("An error occurred. Please try again.");
          return;
        }
        back();
      } catch (error) {
        console.error(error);
        alert("An error occurred. Please try again.");
      }
    },
    [back],
  );

  const deletePayment = useCallback(async (id: Payment["id"]): Promise<void> => {
    try {
      const { error } = await supabase.from(dev_payments).delete().match({ id });
      if (error) {
        console.error(error);
        alert("An error occurred. Please try again.");
        return;
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    }
  }, []);

  const calculateInvoiceBalance = async (monthlyInvoiceId: Payment["monthly_invoice_id"]) => {
    const uid = (await supabase.auth.getSession())?.data.session?.user?.id;

    if (!uid) {
      throw new Error("User ID not found. Please ensure you're authenticated.");
    }

    try {
      const { data: invoices, error } = await supabase
        .from(dev_payments)
        .select("amount, owner_id")
        .eq("monthly_invoice_id", monthlyInvoiceId);

      if (error) {
        throw error; // Rethrow the error for proper handling
      }

      const invoiceBalance = invoices.reduce((acc, cur) => acc + (cur.owner_id === uid ? cur.amount : -cur.amount), 0);

      return invoiceBalance;
    } catch (error) {
      console.error("Error fetching invoice balance:", error);
      return 0; // Return 0 on error for default behavior
    }
  };

  return {
    isRefreshing,
    payments,
    name,
    amount,
    setName,
    setAmount,
    addPayment,
    fetchPaymentsAllByMonthlyInvoiceId,
    updatePayment,
    deletePayment,
    calculateInvoiceBalance,
  };
};
