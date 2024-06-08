import type { Database } from "@/types/supabase";
import { atom } from "jotai";

type Payment = Database["public"]["Tables"]["dev_payments"]["Row"];

export const paymentsAtom = atom<Payment[]>([]);

const getPaymentAtom = (id: Payment["id"]) => atom<Payment>((get) => get(paymentsAtom)[id]);

const addPaymentAtom = atom(null, (_get, set, payment: Payment) => {
  set(paymentsAtom, (prev) => [...prev, payment]);
});

const updatePaymentAtom = atom(null, (_get, set, payment: Payment) => {
  set(paymentsAtom, (prev) => {
    const index = prev.findIndex((p) => p.id === payment.id);
    if (index === -1) {
      return [...prev, payment];
    }
    prev[index] = payment;
    return prev;
  });
});
