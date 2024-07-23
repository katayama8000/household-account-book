import type { ConfigContext, ExpoConfig } from "expo/config";
import { bundleIdByEnv } from "./config";
import { isAppEnv } from "./config/helper";

const appEnv = process.env.APP_ENV ?? "local";
if (!isAppEnv(appEnv)) {
  throw new Error(`unsupported APP_ENV: ${appEnv}`);
}

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    slug: "household-account-book",
    name: "もうふといくら",
    extra: {
      ...config.extra,
      // FIXME: get GOOGLE_SERVICES_JSON from expo secrets
      // android: {
      //   googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
      // },
    },
    android: {
      package: bundleIdByEnv(appEnv),
    },
  };
};
