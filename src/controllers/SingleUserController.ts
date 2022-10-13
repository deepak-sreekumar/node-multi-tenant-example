import { NextFunction, Request, Response } from "express";
import { redisGet, redisSave } from "../helpers/singleTenantRedisHelper";
// import UserModel from "../models/User";

const tenantId = "tenant1";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tenantInfo = await redisGet("company-info");
  console.log(`Got data for tenant ${tenantId}`);
  res.send({ tenantInfo });
  next();
};

export const addCompanyInfo = async (req: Request, res: Response) => {
  redisSave("company-info", `{\"tenantId\":\"${tenantId}\"}`);
  console.log(`Updated data for ${tenantId}`);
  return res.sendStatus(200);
};
