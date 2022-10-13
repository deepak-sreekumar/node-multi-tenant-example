import { NextFunction, Request, Response } from "express";

import { storeSet, contextInIt } from "../context";
import { getTenantRedisClient } from "../config/redis";
import { getTenantSequelizeClient } from "../config/sequelize";

export const apiTenantContextHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  contextInIt(async () => {
    const tenant = req.headers["tenant-id"] as string;
    storeSet("tenant-id", tenant);

    if (!tenant) {
      return res.send(401);
    }
    const sequelize = await getTenantSequelizeClient(tenant);
    storeSet("sequelize", sequelize);

    const redis = getTenantRedisClient(tenant);
    storeSet("redis", redis);

    return next();
  });
};
