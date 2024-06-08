import type { Invoice } from "@/types/Row";
import { atom } from "jotai";

export const invoiceAtom = atom<Invoice[]>([]);
