import { ConsumeMessage } from "amqplib";
import { getTenantSequelizeClient } from "../config/sequelize";
import amqpChannel from "../config/amqpChannel";
import { contextInIt, setKeyInStore } from "../context";
// eslint-disable-next-line @typescript-eslint/ban-types
export const consumerTenantContextHandler = (
  handler: Function,
  functionTag: string
) => {
  return async function (rawMessage: ConsumeMessage | null): Promise<void> {
    const TAG = `[consumerWrapper | ${functionTag}]`;
    if (!rawMessage) {
      return;
    }

    await contextInIt(async () => {
      try {
        const { tenantId, message } = JSON.parse(rawMessage.content.toString());
        console.log(tenantId);
        setKeyInStore("tenant-id", tenantId);
        const sequelize = await getTenantSequelizeClient(tenantId, {
          username: "root",
          password: "root",
        });
        setKeyInStore("sequelize", sequelize);
        console.log(`Setting sequelize in context`);

        await handler(message);
        amqpChannel.ack(rawMessage);
      } catch (error) {
        console.error(
          `${TAG} Exception caught ${error} for message: ${JSON.stringify({
            content: rawMessage.content.toString(),
          })}`
        );
        amqpChannel.ack(rawMessage);
      }
    });
  };
};
