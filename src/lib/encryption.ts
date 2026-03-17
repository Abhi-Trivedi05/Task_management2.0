import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || process.env.ENCRYPTION_KEY || "fallback_secret_key_if_missing";

/**
 * Encrypt a plain text string using AES.
 */
export const encryptPayload = (payload: string): string => {
  return CryptoJS.AES.encrypt(payload, SECRET_KEY).toString();
};

/**
 * Decrypt an AES encrypted string back to plain text.
 */
export const decryptPayload = (encryptedPayload: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedPayload, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

/**
 * Helper to encrypt an object.
 */
export const encryptObject = (obj: any): string => {
  return encryptPayload(JSON.stringify(obj));
};

/**
 * Helper to decrypt an object.
 */
export const decryptObject = <T>(encryptedString: string): T | null => {
  try {
    const jsonStr = decryptPayload(encryptedString);
    if (!jsonStr) return null;
    return JSON.parse(jsonStr) as T;
  } catch (error) {
    console.error("Failed to decrypt object");
    return null;
  }
};
