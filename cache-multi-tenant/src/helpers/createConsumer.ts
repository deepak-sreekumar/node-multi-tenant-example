import { ConsumeMessage, ConfirmChannel } from "amqplib";

import amqpChannel from "../config/amqpChannel";

const createConsumer = (
  queue: string,
  callback: (msg: ConsumeMessage | null) => void,
  prefetchCount = 1
) =>
  amqpChannel.addSetup((channel: ConfirmChannel) => {
    console.info(`[${queue}] Waiting for messages`);
    channel.prefetch(prefetchCount);
    return channel.consume(queue, callback);
  });

export default createConsumer;
