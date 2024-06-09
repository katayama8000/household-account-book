import { supabase } from "@/lib/supabase";
import { useAtom } from "jotai";
import { useState } from "react";
import { invoiceAtom } from "../state/invoice.state";
import type { Invoice } from "@/types/Row";
import { dev_monthly_invoices } from "@/constants/Table";

export const useInvoice = () => {
  const [invoices, setInvoices] = useAtom(invoiceAtom);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchInvoiceByCoupleId = async (couple_id: Invoice["couple_id"]) => {
    const { data, error } = await supabase.from(dev_monthly_invoices).select("*").eq("couple_id", couple_id);

    if (error) {
      console.error(error);
      return;
    }
    if (data) {
      return data[0];
    }
  };

  const fetchInvoices = async () => {
    setIsRefreshing(true);
    const { data, error } = await supabase.from(dev_monthly_invoices).select("*");

    if (error) {
      console.error(error);
      return;
    }
    if (data) {
      setInvoices(data);
    }
    setIsRefreshing(false);
  };

  return { invoices, isRefreshing, fetchInvoices, fetchInvoiceByCoupleId };
};
