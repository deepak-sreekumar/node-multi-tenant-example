import amqpChannel from "../config/amqpChannel";
import { getTenantFromStore } from "./getTenantFromStore";

const tag = "[publishMessageToQueue]";

const publishMessageToQueue = async (
  message: string,
  queue: string,
  priority = 1
): Promise<void> => {
  const tenantId = getTenantFromStore();
  const processedMessage = JSON.stringify({ tenantId, message });
  if (queue) {
    try {
      await amqpChannel.sendToQueue(queue, Buffer.from(processedMessage), {
        priority,
      });

      console.log(`Successfully published the message to queue`, {
        message,
        queue,
        tag,
      });
    } catch (err) {
      const error = err as unknown;
      console.log(`Error occurred while publishing the message to queue`, {
        message,
        queue,
        error,
        tag,
      });
    }
  }
};

export default publishMessageToQueue;
