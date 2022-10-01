import { context } from "../config/context";
import { SafeRedis } from "../config/redis";

export const redisGet = async (url: string): Promise<string | null> => {
  try {
    const store = context.getStore();
    const redisClient = store?.get("redis") as SafeRedis;
    return await redisClient.get(url);
  } catch (error) {
    console.error(`[redisGet] Exception : ${error}`);
  }
  return null;
};
