import { Request, Response } from "express";
import { redisGet } from "../helpers/redisGet";
import UserModel from "../models/User";

export const getAllUsers = async (req: Request, res: Response) => {
  const User = UserModel();
  const users = await User.findAll({});
  const tenantInfo = await redisGet("company-info");
  return res.send({ users, tenantInfo });
};
