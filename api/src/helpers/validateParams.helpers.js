import { DataConstants } from "../constants/index.js";

export class ValidateParamsHelpers {
	static conteudo(dados) {
		if (dados.tipo == DataConstants.TIPO_CONTEUDO.ATIVIDADE || dados.tipo == DataConstants.TIPO_CONTEUDO.EVENTO) {
			return dados.data_evento != null && dados.preco == null && dados.classificacao == null;
		} else if (dados.tipo == DataConstants.TIPO_CONTEUDO.RECOMENDACAO) {
			return dados.preco != null && dados.classificacao != null && dados.data_evento == null;
		} else if (dados.tipo == DataConstants.TIPO_CONTEUDO.ESPACO) {
			return dados.preco == null && dados.classificacao == null && dados.data_evento == null;
		} else {
			return false;
		}
	}
}
