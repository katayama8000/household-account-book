import type { Database } from "@/types/supabase";
import { atom } from "jotai";

type Payment = Database["public"]["Tables"]["dev_payments"]["Row"];

export const paymentAtom = atom<Payment[]>([]);

export const getPaymentAtom = (id: Payment["id"]) => atom<Payment>((get) => get(paymentAtom)[id]);

export const addPayment = atom(null, (_get, set, payment: Payment) => {
  set(paymentAtom, (prev) => [...prev, payment]);
});

export const updatePayment = atom(null, (_get, set, payment: Payment) => {
  set(paymentAtom, (prev) => {
    const index = prev.findIndex((p) => p.id === payment.id);
    if (index === -1) {
      return [...prev, payment];
    }
    prev[index] = payment;
    return prev;
  });
});
