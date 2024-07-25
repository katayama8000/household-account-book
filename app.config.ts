import type { ConfigContext, ExpoConfig } from "expo/config";

const allAppEnvs = ["production", "development", "local"] as const;

type AppEnv = (typeof allAppEnvs)[number];

const bundleIdByEnv = (appEnv: AppEnv): string => {
  switch (appEnv) {
    case "production":
      return "com.katayama9000.householdaccountbook";
    case "development":
      return "com.katayama9000.householdaccountbook.dev";
    case "local":
      return "com.katayama9000.householdaccountbook.local";
  }
};

const googleServicesJsonByEnv = (appEnv: AppEnv): string => {
  switch (appEnv) {
    case "production":
      return "google-services-prod.json";
    case "development":
      return "google-services-dev.json";
    case "local":
      return "google-services-dev.json";
  }
};

const isAppEnv = (s: string): s is AppEnv => {
  return allAppEnvs.some((e) => e === s);
};

const appEnv = process.env.APP_ENV ?? "local";
if (!isAppEnv(appEnv)) {
  throw new Error(`unsupported APP_ENV: ${appEnv}`);
}

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    slug: "household-account-book",
    name: `もうふといくら${appEnv === "production" ? "" : `(${appEnv})`}`,
    extra: {
      ...config.extra,
    },
    android: {
      ...config.android,
      package: bundleIdByEnv(appEnv),
      // FIXME: get GOOGLE_SERVICES_JSON from expo secrets
      googleServicesFile: googleServicesJsonByEnv(appEnv),
    },
  };
};
