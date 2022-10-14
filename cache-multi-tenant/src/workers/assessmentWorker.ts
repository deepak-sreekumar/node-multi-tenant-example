import createConsumer from "../helpers/createConsumer";

import UserModel from "../models/User";
import { consumerTenantContextHandler } from "../middlewares/consumerTenantContextHandler";
import { getTenantFromStore } from "../helpers/getTenantFromStore";
import publishMessageToQueue from "../helpers/publishMessage";
const TAG = "assessmentWorker";

export const processAssessment = async (msg: string | null): Promise<void> => {
  if (!msg) {
    console.error(`[${TAG}] Received invalid/null message`);
    throw new Error("Received empty/null message");
  }

  console.log(`${TAG} Got message ${msg}`);
  const User = UserModel();
  const user = await User.findAll({ raw: true });
  const tenantId = getTenantFromStore();
  console.log(`${TAG} Got User data for ${tenantId}`);
  console.info(user);
  console.log(`${TAG} Publishing mesage to scoring worker`);
  await publishMessageToQueue(msg, "scoringWorker");
};

const worker = consumerTenantContextHandler(
  processAssessment,
  "assessment-worker"
);
createConsumer(TAG, worker);
