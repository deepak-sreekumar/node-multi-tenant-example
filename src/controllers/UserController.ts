import { Request, Response } from "express";
import UserModel from "../models/User";

export const getAllUsers = async (req: Request, res: Response) => {
  const User = UserModel();
  const users = await User.findAll({});

  return res.send(users);
};
