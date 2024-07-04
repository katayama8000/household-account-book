import type { User } from "@/types/Row";
import { atom } from "jotai";

export const userAtom = atom<User | null>(null);
