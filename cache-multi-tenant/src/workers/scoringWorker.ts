import createConsumer from "../helpers/createConsumer";
import { consumerTenantContextHandler } from "../middlewares/consumerTenantContextHandler";
import { getTenantFromStore } from "../helpers/getTenantFromStore";
const TAG = "scoringWorker";

export const processScoring = async (msg: string | null): Promise<void> => {
  if (!msg) {
    console.error(`[${TAG}] Received invalid/null message`);
    throw new Error("Received empty/null message");
  }

  const tenantId = getTenantFromStore();
  console.info(`${TAG}: Got Message for tenant ${tenantId}`);
};

const worker = consumerTenantContextHandler(processScoring, "scoring-worker");
createConsumer(TAG, worker);
