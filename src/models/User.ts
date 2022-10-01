import { INTEGER, Sequelize, STRING } from "sequelize";
import { context } from "../config/context";

const UserTable = () => {
  const store = context.getStore();
  const sequelize = store?.get("sequelize") as Sequelize;
  const User = sequelize?.define(
    "User",
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: STRING,
      },
    },
    { timestamps: false, tableName: "users" }
  );

  return User;
};

export default UserTable;
