import { INTEGER, STRING } from "sequelize";
import { sequelize } from "../config/sequelize";
import Task from "./Task";

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
  { timestamps: false }
);

User.hasMany(Task, {
  foreignKey: "userId",
  sourceKey: "id",
  as: "taskData",
});

Task.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "id",
  as: "taskData",
});

export default User;
