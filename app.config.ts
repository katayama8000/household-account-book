import type { ConfigContext, ExpoConfig } from "expo/config";
import { bundleIdByEnv } from "./init";
import { isAppEnv } from "./init/helper";

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
      // FIXME: get GOOGLE_SERVICES_JSON from expo secrets
      // android: {
      //   googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
      // },
    },
  };
};
