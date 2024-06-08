import { supabase } from "@/lib/supabase";
import { useAtom } from "jotai";
import { useState } from "react";
import { invoiceAtom } from "../state/invoice.state";
import type { Invoice } from "@/types/Row";

export const useInvoice = () => {
  const [invoices, setInvoices] = useAtom(invoiceAtom);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchInvoices = async () => {
    setIsRefreshing(true);
    const { data, error } = await supabase.from("dev_monthly_invoices").select("*");

    if (error) {
      console.error(error);
      return;
    }
    if (data) {
      setInvoices(data);
    }
    setIsRefreshing(false);
  };

  return { invoices, isRefreshing, fetchInvoices };
};
