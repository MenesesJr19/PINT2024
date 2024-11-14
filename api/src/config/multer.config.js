import multer from "multer";
import { Constants } from "../constants/index.js";
import { Utils } from "../utils/index.js";

export class MulterConfig {
	static storage = multer.diskStorage({
		destination: (req, file, cb) => {
			Utils.ensureDirectoryExists(Constants.MULTER_UPLOADS_DIRECTORY);
			cb(null, `${Constants.MULTER_UPLOADS_DIRECTORY}/`);
		},
		filename: (req, file, cb) => {
			const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
			cb(null, file.fieldname + "-" + uniqueSuffix + "." + file.originalname.split(".").pop());
		},
	});

	static upload = multer({ storage: this.storage });
}
