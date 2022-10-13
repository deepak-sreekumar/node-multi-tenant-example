import { Request, Response } from "express";
import { getValueFromStore } from "./context";
import { redisGet, redisSave } from "./helpers/redisHelpers";
import TaskModel from "./models/Task";
import UserModel from "./models/User";

export const getAllUsers = async (req: Request, res: Response) => {
  const Task = TaskModel();
  const User = UserModel();
  const users = await User.findAll({
    include: { model: Task, as: "taskData", attributes: ["task"] },
    attributes: ["email"],
  });
  const tenantInfo = await redisGet("company-info");

  return res.send({ users, tenantInfo });
};

export const insertUser = async (req: Request, res: Response) => {
  const Task = TaskModel();
  const User = UserModel();

  const tenantId = getValueFromStore<string>("tenant-id");

  const reqBody = {
    ...req.body,
    email: `${req.body.email}@${tenantId}.com`,
  };
  await User.create(reqBody, {
    include: { model: Task, as: "taskData" },
  });

  await redisSave("company-info", JSON.stringify({ tenantId }));

  return res.sendStatus(200);
};
