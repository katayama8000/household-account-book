import type { Database } from "./supabase";

export type Couple = Database["public"]["Tables"]["dev_couples"]["Row"];
export type Payment = Database["public"]["Tables"]["dev_payments"]["Row"];
export type Invoice = Database["public"]["Tables"]["dev_monthly_invoices"]["Row"];
