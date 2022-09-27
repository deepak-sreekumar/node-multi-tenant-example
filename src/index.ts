import express from "express";
import { Sequelize } from "sequelize";
import { username, password, host } from "./config/sequelize";
import User from "./models/User";

const app = express();

app.use("/*", async (req, res, next) => {
  const tenant = req.headers["tenant-id"] as string;

  if (!tenant) {
    return res.send(401);
  }

  const sequelize = new Sequelize({
    database: `safe_${tenant}`,
    host,
    username,
    password,
    dialect: "mysql",
  });

  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  //@ts-ignore
  req.models = {
    User: sequelize.define("User", User, { timestamps: false }),
  };

  return next();
});

app.get("/users", async (req, res) => {
  //@ts-ignore
  const { User } = req.models as Record<string, ModelCtor<Model<any, any>>>;

  return res.send(await User.findAll());
});

app.listen(3000, () => {
  console.log("Listening on 3000");
});
