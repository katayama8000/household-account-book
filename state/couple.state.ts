import type { Couple } from "@/types/Row";
import { atom } from "jotai";

export const coupleIdAtom = atom<Couple["id"] | null>(null);
