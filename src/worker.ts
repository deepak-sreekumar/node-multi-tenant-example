import { ConsumeMessage } from "amqplib";

import createConsumer from "./createConsumer";
import amqpChannel from "./config/amqpChannels";

import UserModel from "./models/User";
import { consumerWrapper } from "./consumerWrapper";

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
  console.log("Got User data");
  console.info(user);
  amqpChannel.ack(msg);
};

const worker = consumerWrapper(processAssessment, "assessment-worker");
createConsumer(TAG, worker);
