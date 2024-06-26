import { dev_monthly_invoices } from "@/constants/Table";
import { supabase } from "@/lib/supabase";
import type { Invoice } from "@/types/Row";
import { useAtom } from "jotai";
import { useCallback, useState } from "react";
import { activeInvoiceAtom, invoicesAtom } from "../state/invoice.state";

export const useInvoice = () => {
  const [invoices, setInvoices] = useAtom(invoicesAtom);
  const [invoice] = useAtom(activeInvoiceAtom);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchActiveInvoiceByCoupleId = async (coupleId: Invoice["couple_id"]) => {
    try {
      const { data, error } = await supabase
        .from(dev_monthly_invoices)
        .select("*")
        .eq("couple_id", coupleId)
        .eq("active", true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const fetchInvoiceByCoupleId = useCallback(async (coupleId: Invoice["couple_id"]) => {
    try {
      const { data, error } = await supabase
        .from(dev_monthly_invoices)
        .select("*")
        .eq("couple_id", coupleId)
        .eq("active", true)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }, []);

  const fetchInvoicesAllByCoupleId = useCallback(
    async (id: Invoice["couple_id"]) => {
      setIsRefreshing(true);
      try {
        const { data: invoices, error } = await supabase.from(dev_monthly_invoices).select("*").eq("couple_id", id);

        if (error) throw error;

        if (invoices) {
          setInvoices(invoices);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsRefreshing(false);
      }
    },
    [setInvoices],
  );

  const addInvoice = async (couple_id: Invoice["couple_id"]) => {
    if (!invoice) return;
    try {
      const { error } = await supabase.from(dev_monthly_invoices).insert([
        {
          couple_id,
          is_paid: false,
          active: true,
          month: invoice?.month === 12 ? 1 : invoice?.month + 1,
          year: invoice?.month === 12 ? invoice?.year + 1 : invoice?.year,
        },
      ]);
      if (error) throw error;
    } catch (error) {
      console.error(error);
    }
  };

  const unActiveInvoicesAll = async (couple_id: Invoice["couple_id"]) => {
    try {
      const { error } = await supabase.from(dev_monthly_invoices).update({ active: false }).eq("couple_id", couple_id);
      if (error) throw error;
    } catch (error) {
      console.error(error);
    }
  };

  const turnInvoicePaid = async (invoice_id: Invoice["id"]) => {
    try {
      const { error } = await supabase.from(dev_monthly_invoices).update({ is_paid: true }).eq("id", invoice_id);
      if (error) throw error;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    invoices,
    isRefreshing,
    fetchInvoicesAllByCoupleId,
    fetchInvoiceByCoupleId,
    addInvoice,
    fetchActiveInvoiceByCoupleId,
    unActiveInvoicesAll,
    turnInvoicePaid,
  };
};
