import React, { useEffect, useState } from "react";
import { useLoading } from "hooks/useLoading";
import { EnumConstants } from "data/enum.constants";
import "../painel-tabela.css";
import { ApiRequest } from "api/apiRequest";
import { Botao, Icone, Navegar, Notificacao, OverlayPerfil } from "components";
import { usePopupDialogo } from "hooks/usePopupDialogo";
import { BUTTON_VARIANTS, COMMON_TYPES } from "data/data";
import { Filtros } from "./Filtros";
import { RefreshIcone } from "components/common/icone/RefreshIcone";
import { DateUtils } from "utils/date.utils";
import { Row } from "components/ui/Row";
import { Tabela } from "components/ui/tabela/Tabela";
import { Tooltips } from "components/overlay/tooltip/Tooltip";

const columns = [
	{ id: "tag", label: "Tag", align: "left" },
	{ id: "data_criacao", label: "Data de Criação", align: "left" },
	{ id: "estado", label: "Estado", align: "left" },
	{ id: "titulo", label: "Título", align: "left" },
	{ id: "tipo", label: "Tipo", align: "left" },
	{ id: "subtopico", label: "Subtopico", align: "left" },
	{ id: "acoes", label: "Ações", align: "center" },
];

export function ConteudoPainel() {
	const [dataConteudo, setdataConteudo] = useState(null);
	const [filteredUtilizadores, setFilteredUtilizadores] = useState([]);
	const loading = useLoading();
	const puHandleRevisao = usePopupDialogo();

	useEffect(() => {
		fetchConteudoData();
	}, []);

	const handleRefresh = () => {
		fetchConteudoData();
	};

	const fetchConteudoData = async () => {
		loading.start();
		const data = await ApiRequest.listar("conteudo/revisao");
		setdataConteudo(data);
		setFilteredUtilizadores(data);
		loading.stop();
	};

	const handleUpdateRevisao = async (id, estado) => {
		loading.start();
		puHandleRevisao.conClose();
		await ApiRequest.atualizar("revisao", id, { estado: estado });
		fetchConteudoData();
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

	if (!dataConteudo) return;

	const handlePopupOpen = (id, titulo) => {
		puHandleRevisao.conSet({
			title: `Rever: ${titulo}`,
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

	const rows = filteredUtilizadores.map((item) => ({
		tag: (
			<Tooltips
				trigger={
					<OverlayPerfil
						imagem={item?.conteudo_utilizador?.imagem}
						nome={item?.conteudo_utilizador?.nome}
						tag={`@${item?.conteudo_utilizador?.tag}`}
					/>
				}
			>
				<Navegar to={`/conta/${item?.conteudo_utilizador?.id}`}>@{item?.conteudo_utilizador?.tag}</Navegar>
			</Tooltips>
		),
		data_criacao: DateUtils.DataNormal(item.data_criacao),
		estado: item.revisao_conteudo[0]?.revisao_estado?.estado,
		titulo: <Navegar to={`/conteudos/${item.id}`}>{item?.titulo}</Navegar>,
		tipo: item?.conteudo_tipo?.tipo,
		subtopico: item?.conteudo_subtopico?.area,
		acoes: (
			<Row className="gap-2">
				<Botao
					onClick={() => handlePopupOpen(item.revisao_conteudo[0].id, item?.titulo)}
					variant={BUTTON_VARIANTS.PERIGO}
				>
					<Icone iconName="Hammer" type={COMMON_TYPES.INVERSO} />
				</Botao>
				<Botao route={`/conta/${item?.conteudo_utilizador?.id}`} variant={BUTTON_VARIANTS.SECUNDARIO}>
					<Icone iconName="PersonFill" type={COMMON_TYPES.INVERSO} />
				</Botao>
				<Botao route={`/conteudos/${item.id}`} variant={BUTTON_VARIANTS.SECUNDARIO}>
					<Icone iconName="StarFill" type={COMMON_TYPES.INVERSO} />
				</Botao>
			</Row>
		),
	}));

	return (
		<>
			{puHandleRevisao.conCreate()}
			<Filtros data={dataConteudo} setFiltered={setFilteredUtilizadores} />
			<div className="d-flex justify-content-end mt-4">
				<RefreshIcone handleRefresh={() => handleRefresh()} />
			</div>
			<Tabela
				columns={columns}
				rows={rows}
				maxHeight={"60vh"}
				rowsPerPageOptions={[10, 25, 100]}
				defaultRowsPerPage={10}
				uniqueKey="tag"
			/>
		</>
	);
}
