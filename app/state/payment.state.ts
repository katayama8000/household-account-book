import type { Database } from "@/types/supabase";
import { atom } from "jotai";

type Payment = Database["public"]["Tables"]["dev_payments"]["Row"];

export const paymentsAtom = atom<Payment[]>([]);

export const getPaymentAtom = (id: Payment["id"]) => atom<Payment>((get) => get(paymentsAtom)[id]);

export const addPaymentAtom = atom(null, (_get, set, payment: Payment) => {
  set(paymentsAtom, (prev) => [...prev, payment]);
});

export const updatePaymentAtom = atom(null, (_get, set, payment: Payment) => {
  set(paymentsAtom, (prev) => {
    const index = prev.findIndex((p) => p.id === payment.id);
    if (index === -1) {
      return [...prev, payment];
    }
    prev[index] = payment;
    return prev;
  });
});
