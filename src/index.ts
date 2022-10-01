import express from "express";
import { Sequelize } from "sequelize";
import { username, password, host } from "./config/sequelize";
import { context } from "./config/context";
import { getAllUsers } from "./controllers/UserController";

export const app = express();

app.use((req, res, next) => {
  const store = new Map();
  context.run(store, async () => {
    store.set("request", req);

    const tenant = req.headers["tenant-id"] as string;
    store.set("tenant-id", tenant);

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
    store.set("sequelize", sequelize);

    return next();
  });
});

app.get("/users", getAllUsers);

app.listen(3000, () => {
  console.log("Listening on 3000");
});
