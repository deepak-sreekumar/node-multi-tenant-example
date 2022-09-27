import { Options } from "sequelize";

export const commonConf: Options = {
  pool: {
    max: 2,
    min: 0,
    idle: 0,
    acquire: 3000,
    evict: 60 * 1000,
  },
};

export const username = "root";
export const password = "root";
export const host = "localhost";
