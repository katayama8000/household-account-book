import type { ConfigContext, ExpoConfig } from "expo/config";

const allAppEnvs = ["production", "development", "local"] as const;
type AppEnv = (typeof allAppEnvs)[number];

const envConfigs: Record<AppEnv, { bundleId: string; googleServicesJson: string; name: string }> = {
  production: {
    bundleId: "com.katayama9000.householdaccountbook",
    googleServicesJson: "./google-services-prd.json",
    name: "もうふといくら",
  },
  development: {
    bundleId: "com.katayama9000.householdaccountbook.dev",
    googleServicesJson: "./google-services-dev.json",
    name: "(dev)もうふといくら",
  },
  local: {
    bundleId: "com.katayama9000.householdaccountbook.dev",
    googleServicesJson: "./google-services-dev.json",
    name: "(local)もうふといくら",
  },
};

const isAppEnv = (s: string): s is AppEnv => allAppEnvs.includes(s as AppEnv);

const appEnv = (process.env.APP_ENV ?? "local") as AppEnv;

if (!isAppEnv(appEnv)) throw new Error(`unsupported APP_ENV: ${appEnv}`);

export default ({ config }: ConfigContext): ExpoConfig => {
  const { bundleId, googleServicesJson, name } = envConfigs[appEnv];
  return {
    ...config,
    slug: "household-account-book",
    name,
    extra: {
      ...config.extra,
    },
    android: {
      ...config.android,
      package: bundleId,
      // FIXME: get GOOGLE_SERVICES_JSON from expo secrets
      googleServicesFile: googleServicesJson,
    },
  };
};
