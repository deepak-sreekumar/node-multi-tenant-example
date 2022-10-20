import { KMS } from "aws-sdk";

const tenantKmsMap = {
  tenant1:
    "arn:aws:kms:ap-south-1:457429430701:key/23ebd8f3-2a79-46da-9bf0-cd6d7a01bbd0",
  tenant2:
    "arn:aws:kms:ap-south-1:457429430701:key/548e890b-e410-4b85-b953-d8c4535bb2f3",
  deepak000000c14a5aa30c141efcc63v:
    "arn:aws:kms:ap-south-1:457429430701:key/23ebd8f3-2a79-46da-9bf0-cd6d7a01bbd0",
};

export const getTenantKms = (
  tenantId: string,
  iamCredentials?: AWS.Credentials
): {
  kmsKey: string;
  kms: KMS;
} => {
  const kmsKey = tenantKmsMap[tenantId];
  if (iamCredentials) {
    const kms = new KMS({
      region: "ap-south-1",
      credentials: iamCredentials,
    });
    console.log(
      `[KMS] IAM credentials found. Creating KMS client using tenant tokens`
    );
    return {
      kmsKey,
      kms,
    };
  }

  const kms = new KMS({
    region: "ap-south-1",
  });

  console.log("[KMS] Creating KMS client using machine credentials");

  return {
    kmsKey,
    kms,
  };
};
