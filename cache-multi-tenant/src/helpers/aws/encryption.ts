import crypto from "crypto";

const algorithm = "aes256";
const lengthOfIV = 8;
const lengthOfKey = 32;
const startPositionOfKeySlicing = 0;
const ivString = Buffer.alloc(lengthOfIV).toString("hex");

const encrypt = (textToBeEncrypted: string, key: string): string => {
    const cipher = crypto.createCipheriv(
        algorithm,
        Buffer.from(key)
            .toString("hex")
            .substr(startPositionOfKeySlicing, lengthOfKey),
        ivString
    );
    let encrypted = cipher.update(textToBeEncrypted);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString("base64");
};

const decrypt = (encryptedData: string, key: string): string => {
    const encryptedText = Buffer.from(encryptedData, "base64");
    const decipher = crypto.createDecipheriv(
        algorithm,
        Buffer.from(key)
            .toString("hex")
            .substr(startPositionOfKeySlicing, lengthOfKey),
        ivString
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
};

export { encrypt, decrypt };
