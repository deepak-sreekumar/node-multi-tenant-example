export interface DecryptDataKeyContent {
  plainText: string;
  isSuccess: boolean;
  message: string;
}

export interface EncryptDataKeyContent extends DecryptDataKeyContent {
  cipheredText: string;
}

export interface EncryptedTextAndDataKey {
  dataKey: string;
  encryptedData: string;
}
