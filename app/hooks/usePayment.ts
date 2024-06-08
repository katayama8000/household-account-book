import { dev_payments } from "@/constants/Table";
import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { useEffect, useState, useCallback } from "react";
import { paymentsAtom } from "../state/payment.state";
import type { Invoice, Payment } from "@/types/Row";

export const usePayment = () => {
  const [payments, setPayments] = useAtom(paymentsAtom);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [name, setName] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchAllPayments();
  }, []);

  const monthly_invoice_id = 123;

  const resetForm = () => {
    setName(null);
    setAmount(null);
  };

  const addPayment = useCallback(async (): Promise<void> => {
    if (!name || !amount) {
      alert("Please enter both name and amount.");
      return;
    }

    try {
      const { data, error, status } = await supabase.from(dev_payments).insert([
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

      if (status === 201 && data) {
        alert("Success");
        setPayments((prev) => [...prev, data[0]]);
        resetForm();
        router.back();
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    }
  }, [name, amount, router, setPayments, resetForm]);

  const fetchAllPayments = useCallback(async (): Promise<void> => {
    setIsRefreshing(true);
    try {
      const { data, error } = await supabase.from(dev_payments).select("*");
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
  }, [setPayments]);

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
        fetchAllPayments();
        router.back();
      } catch (error) {
        console.error(error);
        alert("An error occurred. Please try again.");
      }
    },
    [fetchAllPayments, router],
  );

  const deletePayment = useCallback(
    async (id: Payment["id"]): Promise<void> => {
      try {
        const { error } = await supabase.from(dev_payments).delete().match({ id });
        if (error) {
          console.error(error);
          alert("An error occurred. Please try again.");
          return;
        }
        fetchAllPayments();
      } catch (error) {
        console.error(error);
        alert("An error occurred. Please try again.");
      }
    },
    [fetchAllPayments],
  );

  const getTotalPayment = async (monthly_invoice_id: Payment["monthly_invoice_id"]) => {
    const { data, error } = await supabase
      .from("dev_payments")
      .select("amount")
      .eq("monthly_invoice_id", monthly_invoice_id);
    if (error) {
      console.error(error);
      return 0;
    }
    return data.reduce((acc, cur) => acc + cur.amount, 0);
  };

  const getPaymentsByMonthlyInvoiceId = async (id: Invoice["id"]) => {
    const { data, error } = await supabase.from("dev_payments").select("*").eq("monthly_invoice_id", id);
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
    fetchAllPayments,
    fetchPaymentById,
    updatePayment,
    deletePayment,
    getTotalPayment,
    getPaymentsByMonthlyInvoiceId,
  };
};
