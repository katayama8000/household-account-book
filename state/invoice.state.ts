import type { Invoice } from "@/types/Row";
import { atom } from "jotai";

export type InvoiceWithBalance = Invoice & { balance?: number };
export const invoicesAtom = atom<InvoiceWithBalance[]>([]);

export const activeInvoiceAtom = atom<Invoice | null>(null);
