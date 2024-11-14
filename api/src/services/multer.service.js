import { MulterConfig } from "../config/index.js";
import { MulterException } from "../exceptions/index.js";

export class MulterService {
	static async upload(req, file_type) {
		return new Promise((resolve, reject) => {
			MulterConfig.upload.array(file_type)(req, null, (err) => {
				if (err) {
					reject(new MulterException(err));
				} else {
					resolve(req.files);
				}
			});
		});
	}
}
