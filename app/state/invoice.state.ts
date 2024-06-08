import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";
import { atom } from "jotai";

type invoice = Database["public"]["Tables"]["dev_monthly_invoices"]["Row"];

export const invoiceAtom = atom<invoice[]>([]);

export const getinvoiceAtom = (id: invoice["id"]) => atom<invoice>((get) => get(invoiceAtom)[id]);

export const getAllInvoicesAtom = atom<invoice[]>((get) => get(invoiceAtom));

const addInvoiceAtom = atom(null, (_get, set, invoice: invoice) => {
  set(invoiceAtom, (prev) => [...prev, invoice]);
});

const updateInvoiceAtom = atom(null, (_get, set, invoice: invoice) => {
  set(invoiceAtom, (prev) => {
    const index = prev.findIndex((p) => p.id === invoice.id);
    if (index === -1) {
      return [...prev, invoice];
    }
    prev[index] = invoice;
    return prev;
  });
});
