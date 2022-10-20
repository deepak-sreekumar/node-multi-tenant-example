import amqp from "amqp-connection-manager";
import { ConfirmChannel } from "amqplib";

const rabbitMQHost = "localhost";
const rabbitMQPort = "5672";
const rabbitMQUsername = "guest";
const rabbitMQPassword = "guest";
const rabbitMQVhost = "deepak000000c14a5aa30c141efcc63v";

const isRabbitMqSslEnabled =
  process.env.ENABLE_RABBITMQ_TLS && process.env.ENABLE_RABBITMQ_TLS === "true";

const urlPrefix = isRabbitMqSslEnabled ? "amqps" : "amqp";

const rabbitMQUrl = `${urlPrefix}://${rabbitMQUsername}:${rabbitMQPassword}@${rabbitMQHost}:${rabbitMQPort}/${rabbitMQVhost}?heartbeat=20&connection_timeout=10000`;

const amqpConnection = amqp.connect([rabbitMQUrl]);

const amqpChannel = amqpConnection.createChannel({
  json: false,
  setup: (channel: ConfirmChannel) => {
    return Promise.all([
      channel.assertExchange("safe-assessment", "fanout"),
      channel.assertQueue("assessmentWorker", { maxPriority: 10 }),
      channel.prefetch(1),
    ]);
  },
});

export default amqpChannel;
