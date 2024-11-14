export class ErrorException extends Error {
	constructor(mensagem) {
		super(mensagem);
		this.type = "Error";
	}
}
