import { getValueFromStore } from "../context";

export const getTenantFromStore = (): string => {
  return getValueFromStore<string>("tenant-id");
};
