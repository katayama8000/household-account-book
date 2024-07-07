import type { ConfigContext, ExpoConfig } from "expo/config";

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
  };
};
