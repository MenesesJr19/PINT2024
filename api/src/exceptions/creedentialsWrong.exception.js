import { ErrorException } from "./error.exception.js";

export class CreedentialsWrongException extends ErrorException {
	constructor(mensagem) {
		super(mensagem);
		this.type = "CreedentialsWrong";
	}
}
