import { NextFunction, Request, Response } from "express";
import { context } from "../config/context";
import { redisGet, redisSave } from "../helpers/redisGet";
// import UserModel from "../models/User";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const store = context.getStore();
  const tenantId = store?.get("tenant-id") as string;
  const tenantInfo = JSON.parse((await redisGet("company-info")) || "");
  console.log(`Got data for tenant ${tenantId}`);
  res.send({ tenantInfo });
  next();
};

export const addCompanyInfo = async (req: Request, res: Response) => {
  const store = context.getStore();
  const tenantId = store?.get("tenant-id") as string;

  redisSave("company-info", `{\"tenantId\":\"${tenantId}\"}`);
  console.log(`Updated data for ${tenantId}`);
  return res.sendStatus(200);
};
