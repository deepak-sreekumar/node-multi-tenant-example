import { INTEGER, Sequelize, STRING } from "sequelize";
import { storeGet } from "../context";

const Task = () => {

  const sequelize = storeGet<Sequelize>("sequelize");

  const table = sequelize.define(
    "Task",
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: INTEGER,
      },
      task: {
        type: STRING,
      },
    },
    { timestamps: false }
  );

  return table;
};

export default Task;
