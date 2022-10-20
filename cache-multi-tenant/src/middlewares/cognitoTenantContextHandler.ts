import { NextFunction, Request, Response } from "express";

import { setKeyInStore, contextInIt } from "../context";
import { getTenantRedisClient } from "../config/redis";
import { getTenantSequelizeClient } from "../config/sequelize";
import {
  getTenantConfig,
  getTenantId,
  getTokens,
} from "../helpers/tenantContextHelper";
import { getTenantKms } from "../config/kms";

// const tenantConfig = Map<string, unknown>;
export const cognitoTenantContextHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    await contextInIt(async () => {
      const tenantTokens = getTokens(req);
      if (!tenantTokens) {
        return res.send(401);
      }

      const tenantId = tenantTokens && getTenantId(tenantTokens.idToken);

      if (!tenantId) {
        return res.send(401);
      }

      const tenantConfig = await getTenantConfig(tenantId, tenantTokens);

      if (!tenantConfig) {
        return res.send(401);
      }

      setKeyInStore("tenant-id", tenantId);

      const sequelize = await getTenantSequelizeClient(tenantId, {
        username: tenantConfig.secret.dbUserName,
        password: tenantConfig.secret.dbPassword,
      });
      setKeyInStore("sequelize", sequelize);

      const redis = getTenantRedisClient(tenantId, {
        username: tenantConfig.secret.redisUserName,
        password: tenantConfig.secret.redisPassword,
      });
      setKeyInStore("redis", redis);

      const kmsConfig = getTenantKms(tenantId, tenantConfig.iamCredentials);

      setKeyInStore("kmsConfig", kmsConfig);

      return next();
    });
  } catch {
    return res.sendStatus(500);
  }
};
