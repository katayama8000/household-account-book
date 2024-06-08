import type { Payment } from "@/types/Row";
import { atom } from "jotai";

export const paymentsAtom = atom<Payment[]>([]);
