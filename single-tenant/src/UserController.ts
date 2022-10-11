import { Request, Response } from "express";
import Task from "./models/Task";
import User from "./models/User";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.findAll({
    include: { model: Task, as: "taskData", attributes: ["task"] },
    attributes: ["email"],
  });

  return res.send(users);
};

export const insertUser = async (req: Request, res: Response) => {
  const tenantId = "tenant1";

  const reqBody = {
    ...req.body,
    email: `${req.body.email}@${tenantId}.com`,
  };
  await User.create(reqBody, {
    include: { model: Task, as: "taskData" },
  });

  return res.sendStatus(200);
};
