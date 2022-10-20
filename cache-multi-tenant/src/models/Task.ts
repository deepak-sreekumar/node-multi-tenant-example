import { INTEGER, Sequelize, STRING } from "sequelize";
import { getValueFromStore } from "../context";

const Task = () => {
  const sequelize = getValueFromStore<Sequelize>("sequelize");

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
