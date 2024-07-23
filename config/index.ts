import type { AppEnv } from "./appEnv";

export const bundleIdByEnv = (appEnv: AppEnv): string => {
  switch (appEnv) {
    case "production":
      return "com.katayama9000.householdaccountbook";
    case "development":
      return "com.katayama9000.householdaccountbook.dev";
    case "local":
      return "com.katayama9000.householdaccountbook.local";
  }
};
