import express from "express";
import {
  addCompanyInfo,
  getAllUsers,
} from "./controllers/SingleUserController";
import { cleanUp } from "./middlewares/cleanUp";

export const app = express();

app.post("/users", addCompanyInfo);

app.get("/users", getAllUsers);

app.use(cleanUp);

app.listen(3000, () => {
  console.log("Listening on 3000");
});
