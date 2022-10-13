import Redis from "ioredis";

const keyPrefix = `${process.env.TENANT_ID}:`;

/**
 * We are using Transparent Key Prefixing (TKP) (https://github.com/luin/ioredis#transparent-key-prefixing) in ioredis to support multi-tenancy in Redis
 * Each tenant will have a key namespace based on the TENANT_ID and the tenant will only have permission to read/write to that namespace.
 * But TKP does not automatically apply to commands like KEYS and SCAN that take patterns rather than actual keys.
 * For example, the input for the `keys` method is a pattern and ioredis does NOT add the keyPrefix to it automatically.
 * This can lead to some issues such as https://github.com/luin/ioredis/issues/254.
 * Also, TKP will NOT automatically remove the prefix from the key names returned by such methods (https://github.com/luin/ioredis/issues/325).
 * This would mean that if you are fetching key names with any ioredis methods, the returned key will contain the keyPrefix and you'll need to remove the prefix string before using it to fetch/delete values.
 * If you have to use such methods, SafeRedis is a place for extending the Base Redis class to override those to handle keyPrefix (Eg: "keys" method below)
 */
// eslint-disable-next-line functional/no-class
export class SafeRedis extends Redis {
  async keys(pattern: string): Promise<string[]> {
    /**
     * Disabling ES lint warning here since we need to create a patter based on tenant id, which is not a literal
     */
    // eslint-disable-next-line security/detect-non-literal-regexp
    const regExp = new RegExp(`^(${keyPrefix})`);
    const keysWithPrefix = await super.keys(`${keyPrefix}${pattern}`);

    return keysWithPrefix.map((key) => {
      return key.replace(regExp, "");
    });
  }
}
// Using master creds for now
const redisBaseOptions = {
  host: "localhost",
  port: 6379,
  username: "safe",
  password: "safe",
};

/**
 * Connect to Redis Server
 * @param host => Redis Server Host
 * @param port => Redis Server Port
 */

const tenantId = "tenant1";

export const singleTenantRedisClient = new SafeRedis({
  ...redisBaseOptions,
  keyPrefix: `${tenantId}:`,
});
