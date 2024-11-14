import { ErrorException } from "./error.exception.js";

export class MulterException extends ErrorException {
	constructor(mensagem) {
		super(mensagem);
		this.type = "Multer";
	}
}
