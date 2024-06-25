let dev_couples: "dev_couples" | "couples" = "dev_couples";
let dev_monthly_invoices: "dev_monthly_invoices" | "monthly_invoices" = "dev_monthly_invoices";
let dev_payments: "dev_payments" | "payments" = "dev_payments";

if (process.env.EXPO_PUBLIC_APP_ENV === "production") {
  dev_couples = "couples";
  dev_monthly_invoices = "monthly_invoices";
  dev_payments = "payments";
}

export { dev_couples, dev_monthly_invoices, dev_payments };
