import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  const appEnv = process.env.EXPO_PUBLIC_APP_ENV || "development";
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
    slug: "household-account-book",
    name: "もうふといくら",
    extra: {
      ...config.extra,
      extraConfig,
      android: {
        googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
      },
    },
  };
};
