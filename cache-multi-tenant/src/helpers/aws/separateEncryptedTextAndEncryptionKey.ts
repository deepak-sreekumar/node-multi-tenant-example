import { EncryptedTextAndDataKey } from "../../interfaces/aws";

export const MAX_DIGITS_DATA_KEY_LENGTH = 2;

const separateDataAndEncryptionKey = (
  aggregatedEncryptedDataAndEncryptionKey: string
): EncryptedTextAndDataKey => {
  const startOfPaddingDigits = 0;

  const lengthOfKeyLengthAggregatedString = Number(
    aggregatedEncryptedDataAndEncryptionKey.substr(
      startOfPaddingDigits,
      MAX_DIGITS_DATA_KEY_LENGTH
    )
  );
  const keyLength = aggregatedEncryptedDataAndEncryptionKey.substr(
    MAX_DIGITS_DATA_KEY_LENGTH,
    lengthOfKeyLengthAggregatedString
  );
  const dataKey = aggregatedEncryptedDataAndEncryptionKey.substr(
    MAX_DIGITS_DATA_KEY_LENGTH + lengthOfKeyLengthAggregatedString,
    Number(keyLength)
  );
  const encryptedData = aggregatedEncryptedDataAndEncryptionKey.substr(
    MAX_DIGITS_DATA_KEY_LENGTH +
      lengthOfKeyLengthAggregatedString +
      Number(keyLength)
  );
  return {
    dataKey,
    encryptedData,
  };
};

export default separateDataAndEncryptionKey;
