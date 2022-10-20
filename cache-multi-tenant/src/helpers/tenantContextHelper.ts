import jwtDecode from "jwt-decode";
import { Request } from "express";
import axios from "axios";

const SAFE_ENT_URL = "https://deepak-dev-ent-api.safescore.io/v2";
const MAX_FUNCTION_EXECUTION_TIME_SECONDS = 300;

export const getTokens = (
  req: Request
): { accessToken: string; idToken: string } | null => {
  const accessToken = req.headers["authorization"] as string;
  const idToken = req.headers["x-safe-id-token"] as string;
  if (accessToken && idToken) {
    return { accessToken, idToken };
  }
  return null;
};

export const getTenantId = (idToken: string): string | undefined => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const decoded = jwtDecode(idToken) as { [key: string]: string[] };

  const tenantGroup = decoded["cognito:groups"].find((role: string) =>
    role.startsWith("SafeEnt-")
  );

  const tenantId = tenantGroup && tenantGroup.split("SafeEnt-")[1];
  console.log(`Tenant id = ${tenantId}`);

  return tenantId;
};

const tenantConfigCache = new Map<string, TenantConfig>();

export const getTenantConfig = async (
  tenantId: string,
  tenantTokens: {
    accessToken: string;
    idToken: string;
  }
): Promise<TenantConfig | null> => {
  if (tenantConfigCache.has(tenantId)) {
    const result = tenantConfigCache.get(tenantId) as TenantConfig;
    if (result.iamCredentials) {
      // Check for IAM session expiry before returning the tokens from cache
      console.log(`Found existing IAM session for ${tenantId}`);
      const expirationTime = result.iamCredentials.expireTime?.getTime();
      if (expirationTime && !aboutToExpire(expirationTime)) {
        console.log(
          `Session is not about to expire for tenantId = ${tenantId}. Will use it`
        );
        return result;
      }
    }
  }
  const url = `${SAFE_ENT_URL}/tenant/credentials`;
  const headers = {
    Authorization: tenantTokens.accessToken,
    "X-Safe-Id-Token": tenantTokens.idToken,
  };
  const response = await axios.get(url, { headers });
  const secret = JSON.parse(response.data.secret);
  const iamCredentials = response.data.iamCredentials;
  const result = { secret, iamCredentials };

  tenantConfigCache.set(tenantId, result);

  return result;
};

interface TenantConfig {
  secret: {
    redisUserName: string;
    redisPassword: string;
    dbUserName: string;
    dbPassword: string;
  };
  iamCredentials: AWS.Credentials;
}

const aboutToExpire = (expirationTime: number): boolean => {
  if (
    expirationTime - new Date().getTime() <
    MAX_FUNCTION_EXECUTION_TIME_SECONDS * 1000
  ) {
    console.log(
      `Token about to expire. expirationTime = ${expirationTime} MAX_LAMBDA_EXECUTION_TIME_SECONDS = ${MAX_FUNCTION_EXECUTION_TIME_SECONDS}`
    );
    return true;
  }
  return false;
};
