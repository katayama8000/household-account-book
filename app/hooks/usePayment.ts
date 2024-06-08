import { dev_payments } from "@/constants/Table";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { paymentAtom } from "../state/payment.state";

type Payment = Database["public"]["Tables"]["dev_payments"]["Row"];

export const usePayment = () => {
  const [payments, setPayments] = useAtom(paymentAtom);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [name, setName] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchAllPayments();
  }, []);

  const monthly_invoice_id = 123;

  const addPayment = async (): Promise<void> => {
    if (!name || !amount) {
      alert("Please fill out all fields");
      return;
    }
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
      alert("error");
      console.error(error);
      console.log(error);
      return;
    }
    alert("success");
    if (status === 201) {
      setName(null);
      setAmount(null);
      console.log("inserted successfully");
      console.log(data, status);
      fetchAllPayments();
    }
    // close modal
    router.back();
  };

  const fetchAllPayments = async () => {
    console.log("fetching all payments");
    setIsRefreshing(true);
    const { data, error } = await supabase.from(dev_payments).select("*");
    if (error) {
      console.error(error);
      return;
    }
    if (data) {
      setPayments(data);
    }
    setIsRefreshing(false);
  };

  const fetchPaymentById = async (id: number) => {
    const { data, error } = await supabase.from(dev_payments).select("*").eq("id", id);
    if (error) {
      console.error(error);
      return;
    }
    if (data) {
      return data[0];
    }
  };

  const updatePayment = async (id: number, payment: Pick<Payment, "name" | "amount">): Promise<void> => {
    const { data, error, status } = await supabase.from(dev_payments).update(payment).match({ id });
    if (error) {
      console.error(error);
      return;
    }
    fetchAllPayments();
    router.back();
  };

  const deletePayment = async (id: number) => {
    const { error } = await supabase.from(dev_payments).delete().match({ id });
    if (error) {
      console.error(error);
      return;
    }
    fetchAllPayments();
  };

  return {
    payments,
    setPayments,
    isRefreshing,
    name,
    amount,
    setName,
    setAmount,
    addPayment,
    fetchAllPayments,
    deletePayment,
    router,
    fetchPaymentById,
    updatePayment,
  };
};
