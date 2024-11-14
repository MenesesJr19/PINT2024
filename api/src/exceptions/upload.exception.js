import { ErrorException } from "./error.exception.js";

export class UploadException extends ErrorException {
	constructor(mensagem) {
		super(mensagem);
		this.type = "Upload";
	}
}
