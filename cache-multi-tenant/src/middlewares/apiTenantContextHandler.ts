import { NextFunction, Request, Response } from "express";

import { setKeyInStore, contextInIt } from "../context";
import { getTenantRedisClient } from "../config/redis";
import { getTenantSequelizeClient } from "../config/sequelize";
import { getTenantKms } from "../config/kms";

export const apiTenantContextHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  await contextInIt(async () => {
    const tenantId = req.headers["tenant-id"] as string;
    setKeyInStore("tenant-id", tenantId);

    if (!tenantId) {
      return res.send(401);
    }
    const sequelize = await getTenantSequelizeClient(tenantId, {
      username: "root",
      password: "root",
    });
    setKeyInStore("sequelize", sequelize);

    const redis = getTenantRedisClient(tenantId, {
      username: tenantId,
      password: "deepak000000c14a5aa30c141efcc63v",
    });
    setKeyInStore("redis", redis);

    const kmsConfig = getTenantKms(tenantId);

    setKeyInStore("kmsConfig", kmsConfig);

    return next();
  });
};
