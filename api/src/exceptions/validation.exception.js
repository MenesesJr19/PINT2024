import { ErrorException } from "./error.exception.js";

export class ValidationException extends ErrorException {
	constructor(mensagem) {
		super(mensagem);
		this.type = "Validation";
	}
}
