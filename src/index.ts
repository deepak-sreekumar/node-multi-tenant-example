import express from "express";
import { getAllUsers } from "./controllers/UserController";
import { apiTenantContextHandler } from "./middlewares/apiTenantContextHandler";

export const app = express();

app.use(apiTenantContextHandler);

app.get("/users", getAllUsers);

app.listen(3000, () => {
  console.log("Listening on 3000");
});
