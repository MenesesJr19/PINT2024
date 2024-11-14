import { ErrorException } from "./error.exception.js";

export class ScheduleException extends ErrorException {
	constructor(mensagem) {
		super(mensagem);
		this.type = "Schedule";
	}
}
