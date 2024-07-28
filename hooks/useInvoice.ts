import { monthly_invoices_table } from "@/constants/Table";
import { supabase } from "@/lib/supabase";
import type { Invoice } from "@/types/Row";
import { useAtom } from "jotai";
import { useCallback, useState } from "react";
import { activeInvoiceAtom, invoicesAtom } from "../state/invoice.state";

export const useInvoice = () => {
  const [invoices, setInvoices] = useAtom(invoicesAtom);
  const [invoice] = useAtom(activeInvoiceAtom);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchActiveInvoiceByCoupleId = useCallback(async (coupleId: Invoice["couple_id"]) => {
    try {
      const { data, error } = await supabase
        .from(monthly_invoices_table)
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
        const { data: invoices, error } = await supabase.from(monthly_invoices_table).select("*").eq("couple_id", id);

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

  const fetchInvoicesWithBalancesByCoupleId = useCallback(async (id: Invoice["couple_id"]) => {
    const uid = (await supabase.auth.getSession())?.data.session?.user?.id;
    if (!uid) throw new Error("User ID not found. Please ensure you're authenticated.");
    const { data, error } = await supabase
      .from(monthly_invoices_table)
      .select(`
      id,
      month,
      year,
      is_paid,
      dev_payments (
        amount,
        owner_id
      )
    `)
      .eq("couple_id", id);
    if (error) {
      console.error("Error fetching invoices:", error);
      return null;
    }

    if (data) {
      const invoicesWithTotals = data.map((invoice) => ({
        ...invoice,
        balance: invoice.dev_payments.reduce(
          (acc: number, cur: { amount: number; owner_id: string }) =>
            acc + (cur.owner_id === uid ? cur.amount : -cur.amount),
          0,
        ),
      }));
      return invoicesWithTotals;
    }

    return null;
  }, []);

  const addInvoice = async (couple_id: Invoice["couple_id"]) => {
    if (!invoice) return;
    try {
      const { error } = await supabase.from(monthly_invoices_table).insert([
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
      const { error } = await supabase
        .from(monthly_invoices_table)
        .update({ active: false })
        .eq("couple_id", couple_id);
      if (error) throw error;
    } catch (error) {
      console.error(error);
    }
  };

  const turnInvoicePaid = async (invoice_id: Invoice["id"]) => {
    try {
      const { error } = await supabase.from(monthly_invoices_table).update({ is_paid: true }).eq("id", invoice_id);
      if (error) throw error;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    invoices,
    isRefreshing,
    fetchInvoicesAllByCoupleId,
    addInvoice,
    fetchActiveInvoiceByCoupleId,
    unActiveInvoicesAll,
    turnInvoicePaid,
    fetchInvoicesWithBalancesByCoupleId,
  };
};
