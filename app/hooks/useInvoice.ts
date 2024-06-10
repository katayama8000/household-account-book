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

  const getActiveInvoice = async () => {
    const { data, error } = await supabase.from(dev_monthly_invoices).select("*").eq("active", true);

    if (error) throw error;

    return data[0];
  };

  const fetchInvoiceByCoupleId = useCallback(async (coupleId: Invoice["couple_id"]) => {
    try {
      const { data, error } = await supabase
        .from(dev_monthly_invoices)
        .select("*")
        .eq("couple_id", coupleId)
        .eq("active", true);

      if (error) throw error;

      return data[0];
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }, []);

  const fetchInvoicesAll = useCallback(async () => {
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
      await unActiveInvoicesAll(couple_id);
      const { error } = await supabase.from(dev_monthly_invoices).insert([
        {
          couple_id,
          is_paid: false,
          active: true,
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
    fetchInvoicesAll,
    fetchInvoiceByCoupleId,
    addInvoice,
    getActiveInvoice,
    unActiveInvoicesAll,
    turnInvoicePaid,
  };
};
