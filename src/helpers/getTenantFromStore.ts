import { context } from "../config/context";

export const getTenantFromStore = (): string => {
  const store = context.getStore();
  return store?.get("tenant-id") as string;
};
