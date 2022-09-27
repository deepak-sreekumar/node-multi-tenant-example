import { INTEGER, STRING } from "sequelize";

const User = {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: STRING,
  },
};

export default User;
