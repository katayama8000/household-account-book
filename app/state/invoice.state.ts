import type { Invoice } from "@/types/Row";
import { atom } from "jotai";

export const invoicesAllAtom = atom<Invoice[]>([]);

export const activeInvoiceAtom = atom<Invoice | null>(null);
