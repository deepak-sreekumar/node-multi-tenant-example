const MAX_DIGITS_DATA_KEY_LENGTH = 2;
const aggregateEncryptedTextAndDataKey = (
  encryptedText: string,
  dataKey: string
): string => {
  /**
   * We are aggregating encrypted text and data key in to a single string.
   *
   * First two characters of the aggregated string will denote the number
   * of digits in the length of the data key followed by the actual length
   * of the data key which is then followed by the actual encrypted text.
   *
   * Starting two characters are reserved for the number of
   * characters after this to consider for the data key. Max value it can
   * have is 99 which means a 99 digit length of data key
   *
   * Example:
   * encryptedText = "foo"
   * dataKey = "bar"
   *
   * return value = 013barfoo
   *
   * 01 = 1 digit length of data key (consider only one digit after this)
   * 3 = length of data key (consider only three characters after this)
   * bar = data key (consider all characters after this as the encrypted text)
   * foo = encrypted text
   *
   */
  const lengthOfDataKey = dataKey.length.toString();

  const numberOfDigitsInDataKeyLength =
    String(lengthOfDataKey).length.toString();

  const zeroPaddedNumberOfDigits = numberOfDigitsInDataKeyLength.padStart(
    MAX_DIGITS_DATA_KEY_LENGTH,
    "0"
  );

  return `${zeroPaddedNumberOfDigits}${lengthOfDataKey}${dataKey}${encryptedText}`;
};

export default aggregateEncryptedTextAndDataKey;
