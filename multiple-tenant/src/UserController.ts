import { Request, Response } from "express";
import { storeGet } from "./context";
import TaskModel from "./models/Task";
import UserModel from "./models/User";

export const getAllUsers = async (req: Request, res: Response) => {
  const Task = TaskModel();
  const User = UserModel();
  const users = await User.findAll({
    include: { model: Task, as: "taskData", attributes: ["task"] },
    attributes: ["email"],
  });

  return res.send(users);
};

export const insertUser = async (req: Request, res: Response) => {
  const Task = TaskModel();
  const User = UserModel();

  const tenantId = storeGet<string>("tenant-id");

  const reqBody = {
    ...req.body,
    email: `${req.body.email}@${tenantId}.com`,
  };
  await User.create(reqBody, {
    include: { model: Task, as: "taskData" },
  });

  return res.sendStatus(200);
};
