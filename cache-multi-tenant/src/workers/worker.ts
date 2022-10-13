import { ConsumeMessage } from "amqplib";

import createConsumer from "../helpers/createConsumer";
import amqpChannel from "../config/amqpChannel";

import UserModel from "../models/User";
import { consumerTenantContextHandler } from "../middlewares/consumerTenantContextHandler";
import { getTenantFromStore } from "../helpers/getTenantFromStore";
const TAG = "assessmentWorker";

export const processAssessment = async (
  msg: ConsumeMessage | null
): Promise<void> => {
  if (!msg) {
    console.error(`[${TAG}] Received invalid/null message`);
    return;
  }

  console.info("Got Message");

  const User = UserModel();
  const user = await User.findAll({ raw: true });
  const tenantId = getTenantFromStore();
  console.log(`Got User data for ${tenantId}`);
  console.info(user);
  amqpChannel.ack(msg);
};

const worker = consumerTenantContextHandler(
  processAssessment,
  "assessment-worker"
);
createConsumer(TAG, worker);
