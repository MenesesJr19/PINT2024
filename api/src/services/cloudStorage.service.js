import { v2 as cloudinary } from "cloudinary";
import { CloudinaryConstants } from "../constants/index.js";
import { CloudinaryException } from "../exceptions/index.js";

cloudinary.config({
	cloud_name: CloudinaryConstants.CREEDENTIALS.CLOUD_NAME,
	api_key: CloudinaryConstants.CREEDENTIALS.API_KEY,
	api_secret: CloudinaryConstants.CREEDENTIALS.API_SECRET,
});

export class CloudStorageService {
	static async #uploader(filePath, folder_name) {
		try {
			return await cloudinary.uploader.upload(filePath, { folder: folder_name });
		} catch (error) {
			throw new CloudinaryException(error);
		}
	}

	static async upload(filePaths, folder_name) {
		try {
			const uploadResponses = [];

			for (const filePath of filePaths) {
				const uploadResponse = await CloudStorageService.#uploader(filePath, folder_name);
				uploadResponses.push(uploadResponse);
			}

			return uploadResponses;
		} catch (error) {
			throw new CloudinaryException(error);
		}
	}
}
