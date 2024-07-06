import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    slug: "household-account-book",
    name: "もうふといくら",
    extra: {
      ...config.extra,
      android: {
        googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
      },
    },
  };
};
