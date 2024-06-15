import type { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  const appEnv = process.env.APP_ENV || "development";
  const extraConfig = {
    table: {
      couples: "dev_couples",
      payments: "dev_payments",
      monthlyInvoices: "dev_monthly_invoices",
    },
  };

  if (appEnv === "production") {
    extraConfig.table = {
      couples: "couples",
      payments: "payments",
      monthlyInvoices: "monthly_invoices",
    };
  }

  return {
    ...config,
    slug: "my-app",
    name: "家計簿forほのか",
    extra: {
      ...config.extra,
      ...extraConfig,
    },
  };
};
