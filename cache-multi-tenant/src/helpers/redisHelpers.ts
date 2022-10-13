import { SafeRedis } from "../config/redis";
import { getValueFromStore } from "../context";

export const redisGet = async (url: string): Promise<string | null> => {
  try {
    const redisClient = getValueFromStore("redis") as SafeRedis;
    return await redisClient.get(url);
  } catch (error) {
    console.error(`[redisGet] Exception : ${error}`);
  }
  return null;
};
