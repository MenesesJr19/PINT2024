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
import { usePopup } from "hooks/usePopup";
import { DenunciaCartao } from "components/container/cartoes/DenunciaCartao";
import { Row } from "components/ui/Row";
import { DateUtils } from "utils/date.utils";
import { Tabela } from "components/ui/tabela/Tabela";
import { Tooltips } from "components/overlay/tooltip/Tooltip";

const columns = [
	{ id: "utilizador", label: "Utilizador", minWidth: 100 },
	{ id: "dataCriacao", label: "Data de Criação", minWidth: 100 },
	{ id: "estado", label: "Estado", minWidth: 100 },
	{ id: "comentario", label: "Comentário", minWidth: 170 },
	{ id: "acoes", label: "", minWidth: 170, align: "right" },
];

export function ComentarioPainel() {
	const [dataConteudo, setdataConteudo] = useState(null);
	const [filteredUtilizadores, setFilteredUtilizadores] = useState([]);
	const loading = useLoading();
	const puHandleRevisao = usePopupDialogo();
	const popup = usePopup();

	useEffect(() => {
		fetchConteudoData();
	}, []);

	const handleRefresh = () => {
		fetchConteudoData();
	};

	const fetchConteudoData = async () => {
		loading.start();
		const data = await ApiRequest.listar("comentario/revisao");
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

	const handleDenunciasInfoOpen = (id) => {
		const comentario = dataConteudo.find((item) => item.id === id);
		const denuncia = comentario.denuncia_comentario;
		popup.puSet({
			headerTitle: `Denuncias`,
			body: (
				<>
					{denuncia.map((item, i) => (
						<>
							<DenunciaCartao
								id={item?.id}
								title={item?.motivo}
								username={item?.denuncia_utilizador?.tag}
								status={item?.denuncia_estado?.estado}
							/>
						</>
					))}
				</>
			),
		});
		popup.puOpen();
	};

	const rows = filteredUtilizadores.map((item) => ({
		id: item.id,
		utilizador: (
			<Tooltips
				trigger={
					<OverlayPerfil
						imagem={item?.comentario_utilizador?.imagem}
						nome={item?.comentario_utilizador?.nome}
						tag={`@${item?.comentario_utilizador?.tag}`}
					/>
				}
			>
				<Navegar to={`/conta/${item?.comentario_utilizador?.id}`}>@{item?.comentario_utilizador?.tag}</Navegar>
			</Tooltips>
		),
		dataCriacao: DateUtils.DataNormal(item.data_criacao),
		estado: item.revisao_comentario[0].revisao_estado?.estado,
		comentario: (
			<Navegar to={`/conteudos/${item.comentario_conteudo.id}#comentario-${item.id}`}>{item?.comentario}</Navegar>
		),
		acoes: (
			<Row className="gap-2">
				<Botao
					onClick={() => handlePopupOpen(item.revisao_comentario[0].id, item?.comentario)}
					variant={BUTTON_VARIANTS.PERIGO}
				>
					<Icone iconName="Hammer" type={COMMON_TYPES.INVERSO} />
				</Botao>
				{item.denuncia_comentario != null
					? item.denuncia_comentario.length > 0
					: false && (
							<Botao onClick={() => handleDenunciasInfoOpen(item.id)}>
								<Icone iconName="ShieldSlashFill" type={COMMON_TYPES.INVERSO} />
							</Botao>
					  )}
				<Botao route={`/conta/${item?.comentario_utilizador?.id}`} variant={BUTTON_VARIANTS.SECUNDARIO}>
					<Icone iconName="PersonFill" type={COMMON_TYPES.INVERSO} />
				</Botao>
				<Botao
					route={`/conteudos/${item.comentario_conteudo.id}#comentario-${item.id}`}
					variant={BUTTON_VARIANTS.SECUNDARIO}
				>
					<Icone iconName="ChatFill" type={COMMON_TYPES.INVERSO} />
				</Botao>
			</Row>
		),
	}));

	return (
		<>
			{popup.puCreate()}
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
				uniqueKey="id"
			/>
		</>
	);
}
