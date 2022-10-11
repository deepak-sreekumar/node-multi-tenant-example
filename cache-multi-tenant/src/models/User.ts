import { INTEGER, Sequelize, STRING } from "sequelize";
import { storeGet } from "../context";
import Task from "./Task";

const UserTable = () => {
  const sequelize = storeGet<Sequelize>("sequelize");

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

  User.hasMany(Task(), {
    foreignKey: "userId",
    sourceKey: "id",
    as: "taskData",
  });

  Task().belongsTo(User, {
    foreignKey: "userId",
    targetKey: "id",
    as: "taskData",
  });

  return User;
};

export default UserTable;
