import { ErrorException } from "./error.exception.js";

export class NotFoundException extends ErrorException {
	constructor(mensagem) {
		super(mensagem);
		this.type = "NotFound";
	}
}
