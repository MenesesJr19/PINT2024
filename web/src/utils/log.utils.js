export class Log {
	static log(log, prefix = "Log: ") {
		console.log("> " + prefix + log);
	}

	static sucesso(log) {
		this.log(log, "SUCESSO: ");
	}

	static erro(log) {
		this.log(log, "ERRO: ");
	}

	static debug(log) {
		this.log(log, "DEBUG: ");
	}
};