import { ConsumeMessage } from "amqplib";
import { context } from "../config/context";
import { Sequelize } from "sequelize";
import { username, password, host } from "../config/sequelize";
import amqpChannel from "../config/amqpChannels";
// eslint-disable-next-line @typescript-eslint/ban-types
export const consumerTenantContextHandler = (
  handler: Function,
  functionTag: string
) => {
  return async function (message: ConsumeMessage | null): Promise<void> {
    const TAG = `[consumerWrapper | ${functionTag}]`;
    if (!message) {
      return;
    }

    const tenantId = message.content.toString();

    const store = new Map();
    await context.run(store, async () => {
      store.set("tenant-id", tenantId);
      console.log(`Setting tenant id as ${tenantId}`);
      const sequelize = new Sequelize({
        database: `safe_${tenantId}`,
        host,
        username,
        password,
        dialect: "mysql",
      });

      try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
      } catch (error) {
        console.error("Unable to connect to the database:", error);
      }
      store.set("sequelize", sequelize);
      console.log(`Setting sequelise in context`);
    });

    try {
      context.enterWith(store);
      await handler(message);
    } catch (error) {
      console.error(
        `${TAG} Exception caught ${error} for message: ${JSON.stringify({
          ...message,
          content: message.content.toString(),
        })}`
      );
    } finally {
      amqpChannel.ack(message);
    }
  };
};
