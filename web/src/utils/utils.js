import { STATUS } from "data/constants";
import { Log } from "./log.utils";
import UtilizadorDefault from "assets/images/placeholders/user-default.png";
import { EnumConstants } from "data/enum.constants";

export class Utils {
	static isEmpty(...variaveis) {
		try {
			for (let variavel of variaveis) {
				if (
					variavel === STATUS.ERRO ||
					variavel === STATUS.SEM_DATA ||
					!variavel ||
					variavel === null ||
					this.isWhitespaces(variavel)
				) {
					return true;
				}
			}
			return false;
		} catch (error) {
			Log.erro(error);
			return true;
		}
	}

	static waitData(setLoading, ...dataVars) {
		if (this.isEmpty(...dataVars)) {
			setLoading(true);
			return true;
		} else {
			setLoading(false);
			return false;
		}
	}

	static isWhitespaces(variavel) {
		try {
			return variavel?.trim() === "";
		} catch {
			return false;
		}
	}

	static CompareRegex(regex, string) {
		if (typeof regex !== "object" || typeof string !== "string") return false;
		if (!(regex instanceof RegExp)) regex = new RegExp(regex);
		if (regex.test(string)) return true;
		return false;
	}

	static SetImagemUtilizador(imagem) {
		if (imagem) return imagem;
		return UtilizadorDefault;
	}

	static Perms(perfil_array, perfil_user) {
		const isAdmin = perfil_user === EnumConstants.ROLES.ADMIN.ID;
		const temPerfilDefinido = perfil_array && perfil_array.length > 0 && perfil_array.includes(perfil_user);
		const naoTemPerfilDefinido = !perfil_array || perfil_array.length === 0;
		const temAcesso = temPerfilDefinido || naoTemPerfilDefinido || isAdmin;
		return temAcesso;
	}

	static convertoStrToInt(str) {
		return parseInt(str);
	}

	static getTipoById(id) {
		for (const key in EnumConstants.CONTEUDO_TIPOS) {
			if (EnumConstants.CONTEUDO_TIPOS[key].ID === this.convertoStrToInt(id)) {
				return EnumConstants.CONTEUDO_TIPOS[key].TIPO;
			}
		}
	}
}
