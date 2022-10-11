import express from "express";

import User from "./models/User";
import { getAllUsers, insertUser } from "./UserController";

export const app = express();

app.use(express.json());

app.get("/settings", async (req, res) => {
  const users = await User.findAll();

  return res.send(users);
});


app.get("/users", getAllUsers);
app.post("/users", insertUser);

app.listen(3000, () => {
  console.log("Listening on 3000");
});
