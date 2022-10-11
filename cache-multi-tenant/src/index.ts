import express from "express";
import { Sequelize } from "sequelize";
import { username, password, host } from "./config/sequelize";
import { contextInIt, storeSet } from "./context";
import User from "./models/User";
import { getAllUsers, insertUser } from "./UserController";

export const app = express();

const cache = new Map<string, Sequelize>();

app.use(express.json());

app.get("/settings", async (req, res) => {
  const users = await User().findAll();

  return res.send(users);
});

app.use(async (req, res, next) => {
  await contextInIt(async () => {
    const tenant = req.headers["tenant-id"] as string;
    storeSet("tenant-id", tenant);

    if (!tenant) {
      return res.send(401);
    }

    let sequelize: Sequelize;
    if (cache.has(tenant)) {
      sequelize = cache.get(tenant) as Sequelize;
    } else {
      sequelize = new Sequelize({
        database: `safe_${tenant}`,
        host,
        username,
        password,
        dialect: "mysql",
      });
      cache.set(tenant, sequelize);
    }

    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
    storeSet("sequelize", sequelize);

    return next();
  });
});

app.get("/users", getAllUsers);
app.post("/users", insertUser);

app.listen(3000, () => {
  console.log("Listening on 3000");
});
