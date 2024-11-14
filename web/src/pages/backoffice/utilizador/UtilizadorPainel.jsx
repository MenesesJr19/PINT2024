import React, { useEffect, useState } from "react";
import { useLoading } from "hooks/useLoading";
import { DateUtils } from "utils/date.utils";
import { ApiRequest } from "api/apiRequest";
import { Botao, Icone, Popup } from "components";
import { BUTTON_VARIANTS, COMMON_TYPES } from "data/data";
import { ImagemUtilizador } from "components/common/imagem/ImagemUtilizador";
import { ImagemModal } from "components/overlay/imagemModal/ImagemModal";
import { Utils } from "utils/utils";
import { CriarUtilizadorPainel } from "./CriarUtilizadorPainel";
import { Filtros } from "./Filtros";
import { Row } from "components/ui/Row";
import { RefreshIcone } from "components/common/icone/RefreshIcone";
import { Tabela } from "components/ui/tabela/Tabela";

const columns = [
	{ id: "imagem", label: "", minWidth: 50, align: "center" },
	{ id: "tag", label: "Tag", minWidth: 100 },
	{ id: "nomeCompleto", label: "Nome", minWidth: 150 },
	{ id: "email", label: "Email", minWidth: 170 },
	{ id: "inativo", label: "Inativo", minWidth: 50, align: "center" },
	{ id: "verificado", label: "Verificado", minWidth: 50, align: "center" },
	{ id: "perfil", label: "Perfil", minWidth: 120 },
	{ id: "centro", label: "Centro", minWidth: 120 },
	{ id: "dataCriacao", label: "Data criação", minWidth: 50 },
	{ id: "acoes", label: "Ações", minWidth: 200, align: "center" },
];

export function UtilizadorPainel() {
	const [dataUtilizadores, setdataUtilizadores] = useState(null);
	const [filteredUtilizadores, setFilteredUtilizadores] = useState([]);
	const [isPopupOpen, setisPopupOpen] = useState(false);
	const loading = useLoading();

	useEffect(() => {
		fetchConteudoData();
	}, []);

	const fetchConteudoData = async () => {
		loading.start();
		const data = await ApiRequest.listar("utilizador/simples");
		setdataUtilizadores(data);
		setFilteredUtilizadores(data);
		loading.stop();
	};

	const closePopup = () => {
		setisPopupOpen(false);
	};

	const openPopup = () => {
		setisPopupOpen(true);
	};

	const handleCreated = () => {
		fetchConteudoData();
		setisPopupOpen(false);
	};

	const handleVerifyUser = async (id) => {
		loading.start();
		await ApiRequest.atualizar("utilizador", id, { verificado: true });
		await fetchConteudoData();
		loading.stop();
	};

	const handleManageUserStatus = async (id, isInativar) => {
		loading.start();
		await ApiRequest.atualizar("utilizador", id, { inativo: isInativar });
		await fetchConteudoData();
		loading.stop();
	};

	const handleRefresh = async (id, isInativar) => {
		fetchConteudoData();
	};

	const rows = filteredUtilizadores.map((item) => ({
		id: item.id,
		imagem: (
			<ImagemModal imagemSelecionada={Utils.SetImagemUtilizador(item.imagem)}>
				<ImagemUtilizador src={item.imagem} className="card-user-picture" />
			</ImagemModal>
		),
		tag: `@${item.tag}`,
		nomeCompleto: `${item.nome} ${item.sobrenome}`,
		email: item.email,
		inativo: item?.inativo ? (
			<Icone iconName="CheckCircleFill" className="sucesso" />
		) : (
			<Icone iconName="XCircleFill" className="perigo" />
		),
		verificado: item.verificado ? (
			<Icone iconName="CheckCircleFill" className="sucesso" />
		) : (
			<Icone iconName="XCircleFill" className="perigo" />
		),
		perfil: item.utilizador_perfil.perfil,
		centro: item.centro ? item?.utilizador_centro?.centro : "Por definir.",
		dataCriacao: DateUtils.DataNormal(item.data_criacao),
		acoes: (
			<div className="d-flex gap-2">
				<Botao title="Utilizador" route={`/conta/${item.id}`} variant={BUTTON_VARIANTS.SECUNDARIO}>
					<Icone iconName="PersonFill" type={COMMON_TYPES.INVERSO} />
				</Botao>
				{item?.inativo ? (
					<Botao
						title="Ativar"
						onClick={() => handleManageUserStatus(item.id, false)}
						variant={BUTTON_VARIANTS.PERIGO}
					>
						<Icone iconName="UnlockFill" type={COMMON_TYPES.INVERSO} />
					</Botao>
				) : (
					<Botao
						title="Inativar"
						onClick={() => handleManageUserStatus(item.id, true)}
						variant={BUTTON_VARIANTS.PERIGO}
					>
						<Icone iconName="LockFill" type={COMMON_TYPES.INVERSO} />
					</Botao>
				)}
				{!item.verificado && (
					<Botao title="Verificar" onClick={() => handleVerifyUser(item.id)} variant={BUTTON_VARIANTS.SUCESSO}>
						<Icone iconName="Check" type={COMMON_TYPES.INVERSO} />
					</Botao>
				)}
			</div>
		),
	}));

	return (
		<>
			{isPopupOpen && (
				<Popup
					headerTitle={"Adicionar Utilizador"}
					onClose={() => closePopup()}
					body={<CriarUtilizadorPainel handleCreated={() => handleCreated()} />}
				/>
			)}
			<Row className="align-content-between justify-content-between">
				<Botao onClick={() => openPopup()}>
					<Icone iconName="PlusLg" type={COMMON_TYPES.INVERSO} />
				</Botao>
			</Row>
			<Filtros data={dataUtilizadores} filtered={filteredUtilizadores} setFiltered={setFilteredUtilizadores} />
			<div className="d-flex justify-content-end mt-4">
				<RefreshIcone handleRefresh={() => handleRefresh()} />
			</div>
			{dataUtilizadores ? (
				<Tabela columns={columns} rows={rows} uniqueKey="id" maxHeight={"60vh"} />
			) : (
				<p>Carregando...</p>
			)}
		</>
	);
}
