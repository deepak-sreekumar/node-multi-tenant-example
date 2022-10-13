import { AsyncLocalStorage } from "async_hooks";

export const context = new AsyncLocalStorage<Map<string, unknown>>();

export const getValueFromStore = <T>(key: string): T => {
  const store = getStore();
  const userDep = (store as Map<string, T>).get(key);

  if (!userDep) {
    throw new Error(`Value with key ${key} not registered!`);
  }

  return userDep ?? (key as T);
};

export const setKeyInStore = <T>(key: string, value: T) => {
  const store = getStore();
  store.set(key, value);
};

export const contextInIt = <T>(cb: () => T) => {
  return context.run(new Map(), cb);
};

const getStore = () => {
  const store = context.getStore();

  if (store == null) {
    throw new Error(
      'context not registered! Consider, that you call "contextInIt" before'
    );
  }

  return store;
};
