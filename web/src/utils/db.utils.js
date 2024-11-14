import { EnumConstants } from "data/enum.constants";

export class DBUtils {
	static checkRevisao = (revisoes) => {
		for (let revisao of revisoes) if (revisao.estado === EnumConstants.ESTADOS.EM_ANALISE) return true;
	};

	static checkRevisaoRejeitado = (revisoes) => {
		for (let revisao of revisoes) if (revisao.estado === EnumConstants.ESTADOS.REJEITADO) return true;
	};

	static checkParticipanteInConteudo = (participantes, utilizador_id) => {
		for (let participante of participantes) if (participante.utilizador === utilizador_id) return true;
		return false;
	};

	static checkAdminCentro = (data_utilizador, atual_centro) => {
		if (data_utilizador.centro === atual_centro) return true;
		return false;
	};
}
