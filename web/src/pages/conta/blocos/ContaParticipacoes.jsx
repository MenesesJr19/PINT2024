import { ApiRequest } from "api";
import { Contentor, Navegar, Texto } from "components/index";
import { COMMON_SIZES } from "data/data";
import { LoadingContent } from "layouts/loading/LoadingContent";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function ContaParticipacoes() {
	const { id } = useParams();
	const [dataParticipacao, setdataParticipacao] = useState(null);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		await fetchParticipacaoData();
	};
	const fetchParticipacaoData = async () => {
		const data = await ApiRequest.listar("participante", { utilizador: id });
		setdataParticipacao(data);
	};

	return (
		<Contentor>
			<Texto size={COMMON_SIZES.FS3}>Inscrições</Texto>
			{dataParticipacao ? (
				<>
					<div>
						{dataParticipacao?.map((item, index) => (
							<>
								<Navegar to={`/conteudos/${item.participante_conteudo.id}`}>
									{item.participante_conteudo.titulo}
								</Navegar>
								{index < dataParticipacao.length - 1 && ", "}
							</>
						))}
					</div>
				</>
			) : (
				<LoadingContent />
			)}
		</Contentor>
	);
}
