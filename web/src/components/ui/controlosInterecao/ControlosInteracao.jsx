import { Icone, Notificacao, Texto } from "components/index";
import { GOSTO_ANIMATION } from "data/constants";
import { COMMON_SIZES } from "data/data";
import { useState } from "react";
import { Classificacao } from "./classificacao/Classificacao";
import { ApiRequest } from "api";
import { useEffect } from "react";
import { Utils } from "utils/utils";

export function ControlosInteracao({ conteudo_id, utilizador_atual, defaultValue }) {
	const [classificacao, setClassificacao] = useState(0);

	useEffect(() => {
		for (const classificacao of defaultValue) {
			if (classificacao.utilizador === Utils.convertoStrToInt(utilizador_atual.id)) setClassificacao(classificacao.classificacao);
		}
	}, []);

	const handleClassificacaoChange = async (newClassificacao) => {
		setClassificacao(newClassificacao);
		await ApiRequest.criar("classificacao", {
			conteudo: conteudo_id,
			utilizador: utilizador_atual.id,
			classificacao: newClassificacao,
		});
		Notificacao("Conteudo foi classificacado!");
	};

	return (
		<div className="d-flex gap-5 mt-4">
			<div className={`d-flex align-items-center gap-2 post-icon`}>
				<Classificacao value={classificacao} handleChange={handleClassificacaoChange} />
			</div>
		</div>
	);
}
