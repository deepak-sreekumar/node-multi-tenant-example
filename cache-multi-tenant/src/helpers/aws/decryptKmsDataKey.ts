import { AWSError, KMS } from "aws-sdk";

import { getValueFromStore } from "../../context";
import { DecryptDataKeyContent } from "../../interfaces/aws";

const tag = "[DECRYPT_KMS_DATA_KEY]";

const decryptKmsDataKey = async (
  encryptedKey: string
): Promise<DecryptDataKeyContent> => {
  const kmsConfig = getValueFromStore("kmsConfig") as {
    kmsKey: string;
    kms: KMS;
  };

  let isSuccess = false;

  try {
    const decryptedKey = await kmsConfig.kms
      .decrypt({
        CiphertextBlob: Buffer.from(encryptedKey, "base64"),
      })
      .promise();

    if (!decryptedKey.Plaintext) {
      return {
        plainText: "",
        isSuccess,
        message: "Not able to decrypt key from AWS KMS",
      };
    }

    const plainText = decryptedKey.Plaintext.toString();

    isSuccess = true;

    return {
      plainText,
      isSuccess,
      message: "",
    };
  } catch (keyDecryptionError) {
    console.log("Not able to decrypt KMS data key", {
      error: keyDecryptionError as AWSError,
      tag,
    });
    if ((keyDecryptionError as AWSError).code === "AccessDeniedException") {
      console.log(
        `Getting AccessDeniedException for KMS ARN ${kmsConfig.kmsKey} for tenant ID`
      );
    }
    return {
      plainText: "",
      isSuccess,
      message: (keyDecryptionError as AWSError).message,
    };
  }
};

export default decryptKmsDataKey;
