import { Request, Response } from "express";
import { client } from "./config/redis";
import { getValueFromStore } from "./context";
import decryptContent from "./helpers/decryptContent";
import encryptContent from "./helpers/encryptContent";
import { getTenantFromStore } from "./helpers/getTenantFromStore";
import TaskModel from "./models/Task";
import UserModel from "./models/User";

export const getAllUsers = async (req: Request, res: Response) => {
  const Task = TaskModel();
  const User = UserModel();
  const users = await User.findAll({
    include: { model: Task, as: "taskData", attributes: ["task"] },
    attributes: ["email"],
  });
  const tenantInfo = await client().get("company-info");

  const tenantId = getTenantFromStore();

  const encryptedContent = await encryptContent(tenantId);

  console.log(`encryptedContent:${encryptedContent}`);

  const decryptedContent =
    encryptedContent && (await decryptContent(encryptedContent));

  console.log(`decryptedContent:${decryptedContent}`);

  return res.send({ users, tenantInfo, encryptedContent, decryptedContent });
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

  await client().set("company-info", JSON.stringify({ tenantId }));

  return res.sendStatus(200);
};
