let couples_table: "dev_couples" | "couples" = "dev_couples";
let monthly_invoices_table: "dev_monthly_invoices" | "monthly_invoices" = "dev_monthly_invoices";
let payments_table: "dev_payments" | "payments" = "dev_payments";
let users_table: "dev_users" | "users" = "dev_users";

if (process.env.EXPO_PUBLIC_APP_ENV === "production") {
  couples_table = "couples";
  monthly_invoices_table = "monthly_invoices";
  payments_table = "payments";
  users_table = "users";
}

export { couples_table, monthly_invoices_table, payments_table, users_table };
