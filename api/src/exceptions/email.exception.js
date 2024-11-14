import { ErrorException } from "./error.exception.js";

export class EmailException extends ErrorException {
	constructor(mensagem) {
		super(mensagem);
		this.type = "Email";
	}
}
