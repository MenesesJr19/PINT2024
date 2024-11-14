import { ErrorException } from "./error.exception.js";

export class OutOfRangeException extends ErrorException {
	constructor(mensagem) {
		super(mensagem);
		this.type = "OutOfRange";
	}
}
