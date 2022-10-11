import { INTEGER, STRING } from "sequelize";
import { sequelize } from "../config/sequelize";

const Task = sequelize.define(
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

export default Task;
