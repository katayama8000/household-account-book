import { supabase } from "@/lib/supabase";
import { useAtom } from "jotai";
import { useState, useCallback } from "react";
import { invoiceAtom } from "../state/invoice.state";
import type { Invoice } from "@/types/Row";
import { dev_monthly_invoices } from "@/constants/Table";
import dayjs from "dayjs";

export const useInvoice = () => {
  const [invoices, setInvoices] = useAtom(invoiceAtom);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const getCurrentMonthInvoice = useCallback((invoices: Invoice[]): Invoice | undefined => {
    return invoices.find(
      (invoice) =>
        dayjs(invoice.created_at).month() === dayjs().month() && dayjs(invoice.created_at).year() === dayjs().year(),
    );
  }, []);

  const fetchInvoiceByCoupleId = useCallback(
    async (coupleId: Invoice["couple_id"]) => {
      try {
        const { data: invoices, error } = await supabase
          .from(dev_monthly_invoices)
          .select("*")
          .eq("couple_id", coupleId);

        if (error) throw error;

        return getCurrentMonthInvoice(invoices);
      } catch (error) {
        console.error(error);
        return undefined;
      }
    },
    [getCurrentMonthInvoice],
  );

  const fetchAllInvoices = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const { data: invoices, error } = await supabase.from(dev_monthly_invoices).select("*");

      if (error) throw error;

      if (invoices) {
        setInvoices(invoices);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  }, [setInvoices]);

  const addInvoice = async (couple_id: Invoice["couple_id"]) => {
    try {
      const { error } = await supabase.from(dev_monthly_invoices).insert([
        {
          couple_id,
          is_paid: false,
        },
      ]);

      if (error) throw error;

      await fetchAllInvoices();
    } catch (error) {
      console.error(error);
    }
  };

  return { invoices, isRefreshing, fetchAllInvoices, fetchInvoiceByCoupleId, addInvoice };
};
