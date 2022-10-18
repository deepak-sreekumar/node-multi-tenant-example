import { NextFunction, Request, Response } from "express";

import { setKeyInStore, contextInIt } from "../context";
import { getTenantRedisClient } from "../config/redis";
import { getTenantSequelizeClient } from "../config/sequelize";

export const apiTenantContextHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  await contextInIt(async () => {
    const tenant = req.headers["tenant-id"] as string;
    setKeyInStore("tenant-id", tenant);

    if (!tenant) {
      return res.send(401);
    }
    const sequelize = await getTenantSequelizeClient(tenant, {
      username: "root",
      password: "root",
    });
    setKeyInStore("sequelize", sequelize);

    const redis = getTenantRedisClient(tenant, {
      username: tenant,
      password: "deepak000000c14a5aa30c141efcc63v",
    });
    setKeyInStore("redis", redis);

    return next();
  });
};
