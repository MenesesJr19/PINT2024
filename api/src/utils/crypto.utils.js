import crypto from "crypto";

export class CryptoUtils {
	static generatePassword(length = 12) {
		return crypto.randomBytes(length).toString("hex").slice(0, length);
	}
}
