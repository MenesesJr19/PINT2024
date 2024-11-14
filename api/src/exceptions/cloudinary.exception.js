import { ErrorException } from "./error.exception.js";

export class CloudinaryException extends ErrorException {
	constructor(mensagem) {
		super(mensagem);
		this.type = "Cloudinary";
	}
}
