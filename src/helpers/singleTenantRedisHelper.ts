import { singleTenantRedisClient } from "../config/singleTenantRedis";

export const redisGet = async (url: string): Promise<string | null> => {
  try {
    return await singleTenantRedisClient.get(url);
  } catch (error) {
    console.error(`[redisGet] Exception : ${error}`);
  }
  return null;
};

export const redisSave = async (
  url: string,
  value: string
): Promise<string | null> => {
  try {
    return await singleTenantRedisClient.set(url, value);
  } catch (error) {
    console.error(`[redisSave] Exception : ${error}`);
  }
  return null;
};
