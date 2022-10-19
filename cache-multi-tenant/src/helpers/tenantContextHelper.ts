import jwtDecode from "jwt-decode";
import { Request } from "express";
import axios from "axios";

const SAFE_ENT_URL = "https://deepak-dev-ent-api.safescore.io/v2";

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
  let result = null;
  if (tenantConfigCache.has(tenantId)) {
    result = tenantConfigCache.get(tenantId);
  } else {
    const url = `${SAFE_ENT_URL}/tenant/credentials`;
    const headers = {
      Authorization: tenantTokens.accessToken,
      "X-Safe-Id-Token": tenantTokens.idToken,
    };
    const response = await axios.get(url, { headers });
    result = response.data.secret;
    tenantConfigCache.set(tenantId, result);
  }
  return result && JSON.parse(result);
};

interface TenantConfig {
  redisUserName: string;
  redisPassword: string;
  dbUserName: string;
  dbPassword: string;
}
