import { Options } from "sequelize";
import { Sequelize } from "sequelize";

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

const cache = new Map<string, Sequelize>();

export const getTenantSequelizeClient = async (
  tenantId: string,
  credentials: {
    username: string;
    password: string;
  }
): Promise<Sequelize> => {
  let sequelize: Sequelize;
  if (cache.has(tenantId)) {
    sequelize = cache.get(tenantId) as Sequelize;
  } else {
    sequelize = new Sequelize({
      database: `safe_${tenantId}`,
      host,
      username: credentials.username,
      password: credentials.password,
      dialect: "mysql",
    });
    cache.set(tenantId, sequelize);
  }

  await sequelize.authenticate();
  console.log("Connection has been established successfully.");

  return sequelize;
};
