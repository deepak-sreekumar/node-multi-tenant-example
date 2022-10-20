import { AWSError, KMS } from "aws-sdk";

import { getValueFromStore } from "../../context";
import { EncryptDataKeyContent } from "../../interfaces/aws";

const tag = "[GENERATE_KMS_KEY]";

const generateKmsDataKey = async (): Promise<EncryptDataKeyContent> => {
  const kmsConfig = getValueFromStore("kmsConfig") as {
    kmsKey: string;
    kms: KMS;
  };

  let isSuccess = false;
  try {
    const dataKey = await kmsConfig.kms
      .generateDataKey({
        KeyId: kmsConfig.kmsKey,
        KeySpec: "AES_256",
      })
      .promise();

    if (!dataKey.Plaintext || !dataKey.CiphertextBlob) {
      return {
        cipheredText: "",
        plainText: "",
        message: "Not able to generate keys from AWS KMS",
        isSuccess,
      };
    }

    isSuccess = true;
    const plainText = dataKey.Plaintext.toString();
    const cipheredText = dataKey.CiphertextBlob.toString("base64");

    return {
      plainText,
      cipheredText,
      isSuccess,
      message: "",
    };
  } catch (dataKeyGenerationError) {
    console.log("Error in KMS Key Generation", {
      error: dataKeyGenerationError as AWSError,
      tag,
    });
    if ((dataKeyGenerationError as AWSError).code === "AccessDeniedException") {
      console.log(
        `Getting AccessDeniedException for KMS ARN ${kmsConfig.kmsKey} for tenant ID`
      );
    }
    return {
      cipheredText: "",
      plainText: "",
      message: (dataKeyGenerationError as AWSError).message,
      isSuccess,
    };
  }
};

export default generateKmsDataKey;
