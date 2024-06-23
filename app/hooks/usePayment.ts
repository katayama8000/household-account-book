import { dev_payments } from "@/constants/Table";
import { supabase } from "@/lib/supabase";
import type { Invoice, Payment } from "@/types/Row";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
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
  const router = useRouter();
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

    try {
      const { error } = await supabase.from(dev_payments).insert([
        {
          amount,
          monthly_invoice_id,
          name,
          updated_at: dayjs().toISOString(),
          created_at: dayjs().toISOString(),
        },
      ]);

      if (error) {
        console.error(error);
        alert("An error occurred. Please try again.");
        return;
      }

      alert("Success");
      resetForm();
      router.back();
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    }
  }, [name, amount, router, resetForm, fetchInvoiceByCoupleId, coupleId]);

  const fetchPaymentsAllByMonthlyInvoiceId = useCallback(
    async (monthlyInvoiceId: Payment["monthly_invoice_id"]): Promise<void> => {
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
        setPayments(data);
      } catch (error) {
        console.error(error);
        alert("An error occurred. Please try again.");
      } finally {
        setIsRefreshing(false);
      }
    },
    [setPayments],
  );

  const fetchPaymentById = useCallback(async (id: Payment["id"]): Promise<Payment | null> => {
    try {
      const { data, error } = await supabase.from(dev_payments).select("*").eq("id", id);
      if (error) {
        console.error(error);
        alert("An error occurred. Please try again.");
        return null;
      }
      return data ? data[0] : null;
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
      return null;
    }
  }, []);

  const updatePayment = useCallback(
    async (id: Payment["id"], payment: Pick<Payment, "name" | "amount">): Promise<void> => {
      try {
        const { error } = await supabase.from(dev_payments).update(payment).match({ id });
        if (error) {
          console.error(error);
          alert("An error occurred. Please try again.");
          return;
        }
        router.back();
      } catch (error) {
        console.error(error);
        alert("An error occurred. Please try again.");
      }
    },
    [router],
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

  const fetchPaymentTotal = async (monthly_invoice_id: Payment["monthly_invoice_id"]) => {
    const { data, error } = await supabase
      .from(dev_payments)
      .select("amount")
      .eq("monthly_invoice_id", monthly_invoice_id);
    if (error) {
      console.error(error);
      return 0;
    }
    return data.reduce((acc, cur) => acc + cur.amount, 0);
  };

  const fetchPaymentsByMonthlyInvoiceId = async (id: Invoice["id"]) => {
    const { data, error } = await supabase.from(dev_payments).select("*").eq("monthly_invoice_id", id);
    if (error) {
      console.error(error);
      return;
    }
    return data;
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
    fetchPaymentById,
    updatePayment,
    deletePayment,
    fetchPaymentTotal,
    fetchPaymentsByMonthlyInvoiceId,
  };
};
