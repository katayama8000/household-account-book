export const allAppEnvs = ["production", "development", "local"] as const;

export type AppEnv = (typeof allAppEnvs)[number];
