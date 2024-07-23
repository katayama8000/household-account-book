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

const isAppEnv = (s: string): s is AppEnv => {
  return allAppEnvs.some((e) => e === s);
};

const appEnv = process.env.APP_ENV ?? "local";
if (!isAppEnv(appEnv)) {
  throw new Error(`unsupported APP_ENV: ${appEnv}`);
}

export default ({ config }: ConfigContext): ExpoConfig => {
  console.log(`appEnv: ${appEnv}`);
  console.log(`bundleId: ${bundleIdByEnv(appEnv)}`);
  console.log(`config: ${config}`);
  return {
    ...config,
    slug: "household-account-book",
    name: "もうふといくら",
    extra: {
      ...config.extra,
    },
    android: {
      ...config.android,
      package: bundleIdByEnv(appEnv),
      // FIXME: get GOOGLE_SERVICES_JSON from expo secrets
      // googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    },
  };
};
