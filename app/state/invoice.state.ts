import type { Invoice } from "@/types/Row";
import { atom } from "jotai";

export const invoicesAtom = atom<Invoice[]>([]);

export const activeInvoiceAtom = atom<Invoice | null>(null);
