import { allAppEnvs, type AppEnv } from "./appEnv";

export const isAppEnv = (s: string): s is AppEnv => {
  return allAppEnvs.some((e) => e === s);
};
