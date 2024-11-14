import { Notificacao } from "components";

export class Validador {
	constructor(esquema) {
		this.esquema = esquema;
	}

	validar(variaveis) {
		const erros = {};
		Object.keys(this.esquema).forEach((chave) => {
			const regras = this.esquema[chave];
			const valor = variaveis[chave];

			if (regras.min && valor < regras.min) {
				erros[chave] = `Deve ser maior ou igual a ${regras.min}`;
			}

			if (regras.max && valor > regras.max) {
				erros[chave] = `Deve ser menor ou igual a ${regras.max}`;
			}

			if (regras.pattern && !regras.pattern.test(valor)) {
				erros[chave] = `Formato inválido`;
			}

			if (regras.length_max && valor.length >= regras.length_max) {
				erros[chave] = `Deve ser menor ou igual a ${regras.max}`;
			}

			if (regras.length_min && valor.length <= regras.length_min) {
				erros[chave] = `Deve ser maior ou igual a ${regras.length_min}`;
			}

			if (regras.length_min && valor.length <= regras.length_min) {
				erros[chave] = `Deve ser maior ou igual a ${regras.length_min}`;
			}

			if (regras.equals && typeof valor === regras.equals) {
				erros[chave] = `Deve ser igual a ${regras.equals}`;
			}

			if (
				regras.required &&
				(valor === undefined ||
					valor === null ||
					valor === "" ||
					(Array.isArray(valor) && valor.length === 0) ||
					(typeof valor === "object" && Object.keys(valor).length === 0))
			) {
				erros[chave] = "Campo obrigatório";
			}
		});
		return erros;
	}

	isValido(erros) {
		if (erros && Object.entries(erros).length === 0) {
			return true;
		}
		Notificacao("Verifique os campos!", "error");
		return false;
	}
}
