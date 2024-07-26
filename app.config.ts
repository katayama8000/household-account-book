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

const googleServiceFileForAndroidByEnv = (appEnv: AppEnv): string => `./google-services-${appEnv}.json`;

const isAppEnv = (s: string): s is AppEnv => allAppEnvs.some((e) => e === s);

const appEnv = process.env.APP_ENV ?? "local";

if (!isAppEnv(appEnv)) throw new Error(`unsupported APP_ENV: ${appEnv}`);

export default ({ config }: ConfigContext): ExpoConfig => {
  console.log(`appEnv: ${appEnv}`);
  console.log(`bundleId: ${bundleIdByEnv(appEnv)}`);
  console.log(`googleServiceFile: ${googleServiceFileForAndroidByEnv(appEnv)}`);
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
      googleServicesFile: googleServiceFileForAndroidByEnv(appEnv),
    },
  };
};
