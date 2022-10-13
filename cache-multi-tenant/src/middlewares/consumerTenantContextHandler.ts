import { ConsumeMessage } from "amqplib";
import { getTenantSequelizeClient } from "../config/sequelize";
import amqpChannel from "../config/amqpChannel";
import { contextInIt, setKeyInStore } from "../context";
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

    await contextInIt(async () => {
      setKeyInStore("tenant-id", tenantId);
      console.log(`Setting tenant id as ${tenantId}`);
      const sequelize = await getTenantSequelizeClient(tenantId);
      setKeyInStore("sequelize", sequelize);
      console.log(`Setting sequelize in context`);

      try {
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
    });
  };
};
