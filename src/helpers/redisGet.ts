import { context } from "../config/context";
import { SafeRedis } from "../config/redis";

export const redisGet = async (url: string): Promise<string | null> => {
  const store = context.getStore();
  const redisClient = store?.get("redis") as SafeRedis;
  return await redisClient.get(url);
};

export const redisSave = async (
  url: string,
  value: string
): Promise<string | null> => {
  const store = context.getStore();
  const redisClient = store?.get("redis") as SafeRedis;
  return await redisClient.set(url, value);
};
