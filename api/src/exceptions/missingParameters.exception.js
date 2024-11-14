import { ErrorException } from "./error.exception.js";

export class MissingParametersException extends ErrorException {
	constructor(mensagem) {
		super(mensagem);
		this.type = "MissingParameters";
	}
}
