import { NextFunction, Request, Response } from "express";
// import { Sequelize } from "sequelize";
import { context } from "../config/context";
// import { username, password, host } from "./../config/sequelize";
import { getTenantRedisClient } from "../config/redis";

export const apiTenantContextHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const store = new Map();
  context.run(store, async () => {
    store.set("request", req);

    const tenant = req.headers["tenant-id"] as string;
    store.set("tenant-id", tenant);

    if (!tenant) {
      return res.send(401);
    }

    // const sequelize = new Sequelize({
    //   database: `safe_${tenant}`,
    //   host,
    //   username,
    //   password,
    //   dialect: "mysql",
    // });

    // try {
    //   await sequelize.authenticate();
    //   console.log("Connection has been established successfully.");
    // } catch (error) {
    //   console.error("Unable to connect to the database:", error);
    // }
    // store.set("sequelize", sequelize);

    const redis = getTenantRedisClient(tenant);

    store.set("redis", redis);

    return next();
  });
};
