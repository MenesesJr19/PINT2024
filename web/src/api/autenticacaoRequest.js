import { AUTH_KEY, STATUS } from "data/constants";
import { Log } from "utils/log.utils";
import { myAxios } from "./axios";
import { AuthTokenUtils } from "../utils/authToken.utils";

export class AutenticacaoRequest {
	static async entrar(login, senha) {
		try {
			const response = await myAxios({
				url: "/autenticacao/entrar",
				method: "post",
				data: { login, senha },
			});
			if (response?.token) {
				AuthTokenUtils.set(response.token);
				return response;
			} else if (response.status === 422 || response.status === 401) {
				return response;
			}
			return STATUS.ERRO;
		} catch (error) {
			Log.erro(error);
			return STATUS.ERRO;
		}
	}

	static async terminar_sessao() {
		AuthTokenUtils.remove();
	}

	static async obterUtilizadorAtual() {
		try {
			const token = AuthTokenUtils.get();
			if (!token) return false;
			const response = await myAxios({
				url: "/autenticacao/obter",
				method: "get",
				headers: { Authorization: `Bearer ${token}` },
			});
			return response;
		} catch (error) {
			Log.erro(error);
			return STATUS.ERRO;
		}
	}

	static async externalLogin(token) {
		try {
			const response = await myAxios({
				url: "/autenticacao/external-login",
				method: "post",
				data: { token: token },
			});
			if (response?.token) {
				AuthTokenUtils.set(response.token);
				return response;
			} else if (response.status === 422 || response.status === 401) {
				return response;
			}
			return STATUS.ERRO;
		} catch (error) {
			Log.erro(error);
			return STATUS.ERRO;
		}
	}

	static async atualizarToken() {
		try {
			const token = AuthTokenUtils.get();
			if (!token) return false;

			const response = await myAxios({
				url: "/autenticacao/atualizar",
				method: "get",
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!(response && response.token)) throw new Error("Não recebeu resposta!");

			const new_token = response.token;
			AuthTokenUtils.set(new_token);
		} catch (error) {
			Log.erro(error);
			return STATUS.ERRO;
		}
	}

	static async forgotPassword(email) {
		try {
			const response = await myAxios({
				url: "/autenticacao/forgot-password",
				method: "post",
				data: { email: email },
			});
			if (!response) throw new Error("Não recebeu resposta!");
			return true;
		} catch (error) {
			Log.erro(error);
			return false;
		}
	}

	static async resetPassword(token, senha, confirmacao_senha) {
		try {
			const response = await myAxios({
				url: "/autenticacao/reset-password",
				method: "post",
				data: {
					senha: senha,
					confirmacao_senha: confirmacao_senha,
					token: token,
				},
			});
			if (!response) throw new Error("Não recebeu resposta!");
			return true;
		} catch (error) {
			Log.erro(error);
			return false;
		}
	}

	static async atualizarPasse(token, senha, senha_old) {
		try {
			const response = await myAxios({
				url: "/autenticacao/atualizar-password",
				method: "post",
				data: { token: token, senha: senha, senha_old: senha_old },
			});
			if (!response) throw new Error("Não recebeu resposta!");
			if (response.token) {
				AuthTokenUtils.set(response.token);
				return response;
			}
			return false;
		} catch (error) {
			Log.erro(error);
			return false;
		}
	}
}
