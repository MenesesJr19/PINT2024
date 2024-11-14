import { ErrorException } from "./error.exception.js";

export class ServerException extends ErrorException {
	constructor(mensagem) {
		super(mensagem);
		this.type = "Server";
	}
}
