import type { Database } from "./supabase";

export type Couple = Database["public"]["Tables"]["couples"]["Row"];
export type Payment = Database["public"]["Tables"]["payments"]["Row"];
export type Invoice = Database["public"]["Tables"]["monthly_invoices"]["Row"];
export type User = Database["public"]["Tables"]["users"]["Row"];
