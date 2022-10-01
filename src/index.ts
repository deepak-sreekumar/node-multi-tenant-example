import express from "express";
import { getAllUsers } from "./controllers/UserController";
import { apiTenantContextHandler } from "./middlewares/apiTenantContextHandler";
import { cleanUp } from "./middlewares/cleanUp";

export const app = express();

app.use(apiTenantContextHandler);

app.get("/users", getAllUsers);

app.use(cleanUp);

app.listen(3000, () => {
  console.log("Listening on 3000");
});
