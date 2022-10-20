import generateKmsDataKey from "../helpers/aws/generateKmsDataKey";
import { encrypt } from "../helpers/aws/encryption";
import aggregateEncryptedTextAndDataKey from "./aws/aggregateEncryptedTextAndDataKey";
import { EncryptDataKeyContent } from "../interfaces/aws";

const tag = "[KMS_ENCRYPTION]";

let generatedDataKey: null | EncryptDataKeyContent = null;

const encryptContent = async (content: string): Promise<string | null> => {
  if (!generatedDataKey || !generatedDataKey.isSuccess) {
    generatedDataKey = await generateKmsDataKey();

    if (!generatedDataKey?.isSuccess) {
      console.log("Not able to generate encryption key", {
        tag,
      });
      return null;
    }
  }

  const encryptedContent = aggregateEncryptedTextAndDataKey(
    encrypt(content, generatedDataKey.plainText),
    generatedDataKey.cipheredText
  );

  console.log("Sent encrypted content using KMS", { tag });

  return encryptedContent;
};

export default encryptContent;
