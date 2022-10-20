import decryptKmsDataKey from "../helpers/aws/decryptKmsDataKey";
import separateDataAndEncryptionKey from "../helpers/aws/separateEncryptedTextAndEncryptionKey";
import { decrypt } from "../helpers/aws/encryption";

const tag = "[KMS_ENCRYPTION]";

const decryptContent = async (content: string): Promise<null | string> => {
  /**
   * Separate Encryption Data and Encryption Key
   */
  const { encryptedData, dataKey } = separateDataAndEncryptionKey(content);

  /**
   * Decrypt Data Encryption Key to get Plain text key for data decryption
   */
  const decryptedKey = await decryptKmsDataKey(dataKey);

  if (!decryptedKey.isSuccess) {
    console.log("Not able to decrypt encryption key", { tag });
    return null;
  }

  /**
   * Decrypt the data from Plain text key
   */
  const decryptedContent: string = decrypt(
    encryptedData,
    decryptedKey.plainText
  );

  console.log("Sent decrypted content using KMS", { tag });

  return decryptedContent;
};

export default decryptContent;
