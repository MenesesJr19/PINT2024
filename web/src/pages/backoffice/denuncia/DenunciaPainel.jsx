import { ApiRequest } from "api";
import { Botao, Icone, Navegar, Notificacao } from "components";
import { RefreshIcone } from "components/common/icone/RefreshIcone";
import { Row } from "components/ui/Row";
import { Tabela } from "components/ui/tabela/Tabela";
import { BUTTON_VARIANTS, COMMON_TYPES } from "data/data";
import { EnumConstants } from "data/enum.constants";
import { useLoading } from "hooks/useLoading";
import { usePopupDialogo } from "hooks/usePopupDialogo";
import { useEffect } from "react";
import { useState } from "react";
import { Filtros } from "./Filtros";

const columns = [
	{ id: "motivo", label: "Motivo", minWidth: 170 },
	{ id: "data_criacao", label: "Data de Criação", minWidth: 100 },
	{ id: "estado", label: "Estado", minWidth: 170 },
	{ id: "comentario", label: "Comentario", minWidth: 170 },
	{ id: "denunciado", label: "Denunciado", minWidth: 170 },
	{ id: "denunciou", label: "Denunciou", minWidth: 170 },
	{ id: "acoes", label: "", minWidth: 50, align: "center" },
];

export function DenunciaPainel() {
	const [dataDenuncias, setDataDenuncias] = useState([]);
	const [filteredDenuncias, setFilteredDenuncias] = useState([]);
	const loading = useLoading();
	const puHandleRevisao = usePopupDialogo();

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		const hash = window.location.hash;
		if (hash) {
			const element = document.getElementById(hash.substring(1));
			if (element) {
				element.scrollIntoView({ behavior: "smooth" });
			}
		}
	}, [dataDenuncias]);

	const fetchData = async () => {
		loading.start();
		const data = await ApiRequest.listar("denuncia");
		setDataDenuncias(data);
		setFilteredDenuncias(data);
		loading.stop();
	};

	const handleRefresh = async () => {
		await fetchData();
	};

	const handleUpdateRevisao = async (id, estado) => {
		loading.start();
		puHandleRevisao.conClose();
		await ApiRequest.atualizar("denuncia", id, { estado: estado });
		fetchData();
		Notificacao("Estado da revisão atualizado com sucesso!");
	};

	const handleRevisaoAprovada = async (id) => {
		handleUpdateRevisao(id, EnumConstants.ESTADOS.APROVADO);
	};

	const handleRevisaoRejeitada = async (id) => {
		handleUpdateRevisao(id, EnumConstants.ESTADOS.REJEITADO);
	};

	const handleRevisaoAnalise = async (id) => {
		handleUpdateRevisao(id, EnumConstants.ESTADOS.EM_ANALISE);
	};

	const handlePopupOpen = (id) => {
		puHandleRevisao.conSet({
			title: `Analisar denuncia`,
			body: null,
			footer: (
				<>
					<Botao variant={BUTTON_VARIANTS.SUCESSO} onClick={() => handleRevisaoAprovada(id)}>
						<Icone iconName="XLg" className="icon-inverse" /> Aprovar
					</Botao>
					<Botao variant={BUTTON_VARIANTS.SECUNDARIO} onClick={() => handleRevisaoAnalise(id)}>
						<Icone iconName="XLg" className="icon-inverse" /> Análise
					</Botao>
					<Botao variant={BUTTON_VARIANTS.PERIGO} onClick={() => handleRevisaoRejeitada(id)}>
						<Icone iconName="XLg" className="icon-inverse" /> Rejeitar
					</Botao>
				</>
			),
		});
		puHandleRevisao.conOpen();
	};

	const rows = filteredDenuncias.map((item) => ({
		id: item.id,
		motivo: item.motivo,
		data_criacao: item.data_criacao,
		estado: item.denuncia_estado.estado,
		comentario: item.denuncia_comentario.comentario,
		denunciado: (
			<Navegar to={`/conta/${item.denuncia_comentario.comentario_utilizador.id}`}>
				@{item.denuncia_comentario.comentario_utilizador.tag}
			</Navegar>
		),
		denunciou: <Navegar to={`/conta/${item.denuncia_utilizador.id}`}>@{item.denuncia_utilizador.tag}</Navegar>,
		acoes: (
			<Row className="gap-2">
				<Botao onClick={() => handlePopupOpen(item.id)} variant={BUTTON_VARIANTS.PERIGO}>
					<Icone iconName="Hammer" type={COMMON_TYPES.INVERSO} />
				</Botao>
				<Botao
					route={`/conteudos/${item.denuncia_comentario.comentario_conteudo.id}#comentario-${item.denuncia_comentario.id}`}
					variant={BUTTON_VARIANTS.SECUNDARIO}
				>
					<Icone iconName="ChatFill" type={COMMON_TYPES.INVERSO} />
				</Botao>
			</Row>
		),
	}));

	return (
		<>
			{puHandleRevisao.conCreate()}
			<Filtros data={dataDenuncias} filtered={filteredDenuncias} setFiltered={setFilteredDenuncias} />
			<div className="d-flex justify-content-end mt-4">
				<RefreshIcone handleRefresh={() => handleRefresh()} />
			</div>
			<Tabela
				columns={columns}
				rows={rows}
				maxHeight={"60vh"}
				rowsPerPageOptions={[10, 25, 100]}
				defaultRowsPerPage={10}
				uniqueKey="id"
			/>
		</>
	);
}
