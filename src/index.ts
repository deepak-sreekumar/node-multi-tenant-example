import express from "express";
import { addCompanyInfo, getAllUsers } from "./controllers/UserController";
import { apiTenantContextHandler } from "./middlewares/apiTenantContextHandler";
import { cleanUp } from "./middlewares/cleanUp";

export const app = express();

app.use(apiTenantContextHandler);

app.post("/users", addCompanyInfo);

app.get("/users", getAllUsers);

app.use(cleanUp);

app.listen(3000, () => {
  console.log("Listening on 3000");
});
