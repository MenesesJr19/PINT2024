import { Icone, Texto, Contentor, Botao, Navegar, Imagem, Popup, ComboBox } from "components/index";
import { BUTTON_VARIANTS, COMMON_SIZES, COMMON_TYPES } from "data/data";
import { DateUtils } from "utils/date.utils";
import { ImagemModal } from "components/overlay/imagemModal/ImagemModal";
import UtilizadorDefault from "assets/images/placeholders/user-default.png";
import "../conta.css";
import { ImagemUtilizador } from "components/common/imagem/ImagemUtilizador";
import { LabelError } from "layouts/labelWarnings/LabelError";
import { useEffect, useState } from "react";
import { InteressesList } from "../InteressesList";
import { useCurrentUser } from "hooks/useCurrentUser";
import { ApiRequest } from "api";
import { useLoading } from "hooks/useLoading";
import { Authorizor } from "components/helpers/Authorizor";
import { EnumConstants } from "data/enum.constants";
import { AuthorizorHelper } from "components/helpers/AuthorizorHelper";
import { Row } from "components/ui/Row";
import { useConfirmation } from "hooks/useConfirmation";
import { LoadingContent } from "layouts/loading/LoadingContent";
import { useParams } from "react-router-dom";
import { Utils } from "utils/utils";

export function ContaPrincipal() {
	const [isPopupOpen, setisPopupOpen] = useState(false);
	const [dataConta, setdataConta] = useState(null);
	const [dataPerfis, setdataPerfis] = useState();
	const [listInteresses, setlistInteresses] = useState("");
	const [selectPerfil, setselectPerfil] = useState();
	const [dataCentro, setdataCentro] = useState();
	const [selectCentro, setselectCentro] = useState();
	const loading = useLoading();
	const utilizadorAtual = useCurrentUser();
	const { conCreate, conSet, conOpen, conClose } = useConfirmation();
	const { id } = useParams();

	useEffect(() => {
		if (!dataConta) return;
		setselectPerfil(dataConta?.perfil);
		setselectCentro(dataConta?.centro);
		setlistInteresses(getInteresses());
	}, [dataConta]);

	useEffect(() => {
		handleUpdatePerfil();
	}, [selectPerfil]);

	useEffect(() => {
		handleUpdateCentro();
	}, [selectCentro]);

	useEffect(() => {
		handleFetchData();
	}, []);

	const handleUpdatePerfil = async () => {
		loading.start();
		await ApiRequest.atualizar("utilizador", id, { perfil: selectPerfil });
		loading.stop();
	};

	const handleUpdateCentro = async () => {
		loading.start();
		await ApiRequest.atualizar("utilizador", id, { centro: selectCentro });
		loading.stop();
	};

	const handleFetchData = async () => {
		await handleFetchContaData();
		await handleFetchPerfil();
		await handleFetchCentro();
	};

	const handleFetchContaData = async () => {
		const data = await ApiRequest.obter("utilizador/simples", id);
		setdataConta(data);
	};

	const handleFetchPerfil = async () => {
		const data = await ApiRequest.listar("perfil/simples");
		setdataPerfis(data);
	};

	const handleFetchCentro = async () => {
		const data = await ApiRequest.listar("centro/simples");
		setdataCentro(data);
	};

	const getInteresses = () => {
		let interesses = "";
		for (let interesse of dataConta.interesse_utilizador) {
			interesses += interesse.interesse_subtopico.area + ", ";
		}
		return interesses;
	};

	if (!dataPerfis || !dataCentro) return;

	const transformarDadosPerfil = () => {
		return dataPerfis?.map((item) => ({
			value: item.id,
			label: item.perfil,
		}));
	};

	const transformarDadosCentro = () => {
		return dataCentro?.map((item) => ({
			value: item?.id,
			label: item?.centro,
		}));
	};

	const handleInativar = async () => {
		await ApiRequest.atualizar("utilizador", id, { inativo: dataConta.inativo ? false : true });
		await handleFetchData();
	};

	const handleOpenConfirmacaoInativar = () => {
		if (!dataConta.inativo) {
			conSet({
				title: "Inativar o utilizador",
				body: "",
				onSuccess: handleInativar,
				onError: conClose,
				successLabel: "Inativar",
				errorLabel: "Cancelar",
			});
		} else {
			conSet({
				title: "Remover inativação do utilizador",
				body: "",
				onSuccess: handleInativar,
				onError: conClose,
				successLabel: "Remover",
				errorLabel: "Cancelar",
			});
		}
		conOpen();
	};

	return (
		<>
			<Contentor>
				{dataConta && dataCentro && dataPerfis ? (
					<>
						{conCreate()}
						{isPopupOpen && (
							<Popup
								headerTitle={"Adicionar Interesses"}
								onClose={() => setisPopupOpen(false)}
								body={<InteressesList id={id} onClose={() => setisPopupOpen(false)} />}
							/>
						)}
						{dataConta?.inativo && <LabelError texto="Utilizador está inativo!" />}
						<div className="main-box-content">
							<div className="mb-content-image">
								<ImagemModal imagemSelecionada={dataConta.imagem ? dataConta.imagem : UtilizadorDefault}>
									<ImagemUtilizador src={dataConta.imagem} className="image-size circular-image" />
								</ImagemModal>
							</div>
							<div>
								<Texto size={COMMON_SIZES.FS5}>{dataConta.nome + " " + dataConta.sobrenome}</Texto>
								<Texto size={COMMON_SIZES.FS0}>{"@" + dataConta.tag}</Texto>
							</div>
							<div className="content-details d-flex justify-content-between mt-3">
								<div className="details-left">
									<div className="d-flex align-items-center gap-2">
										<Texto className="d-flex gap-1 align-items-center">
											<Icone iconName="Calendar3" />
											{DateUtils.MesNome_Ano(dataConta.data_criacao)}
										</Texto>
									</div>
									{dataConta.utilizador_centro?.centro && (
										<div className="d-flex gap-3">
											<div className="d-flex align-items-center gap-2">
												<Texto className="d-flex gap-1 align-items-center">
													<Icone iconName="Buildings" />
													{dataConta.utilizador_centro?.centro}
												</Texto>
											</div>
										</div>
									)}
									{listInteresses && (
										<div className="d-flex align-items-center gap-2">
											<Texto className="d-flex gap-1 align-items-center">
												<Icone iconName="HandThumbsUp" />
												{listInteresses}
											</Texto>
										</div>
									)}
									<Row className="gap-3">
										{dataConta.instagram && (
											<Navegar to={dataConta.instagram} target="_blank">
												<Icone size={COMMON_SIZES.FS4} iconName="Instagram" />
											</Navegar>
										)}
										{dataConta.linkedin && (
											<Navegar to={dataConta.linkedin} target="_blank">
												<Icone size={COMMON_SIZES.FS4} iconName="Linkedin" />
											</Navegar>
										)}
										{dataConta.facebook && (
											<Navegar to={dataConta.facebook} target="_blank">
												<Icone size={COMMON_SIZES.FS4} iconName="Facebook" />
											</Navegar>
										)}
									</Row>
								</div>
								<div
									className="details-right d-flex flex-column align-items-end gap-2"
									style={{ width: "500px" }}
								>
									<Row className="gap-3">
										{utilizadorAtual.id === Utils.convertoStrToInt(id) && (
											<Botao variant={BUTTON_VARIANTS.SECUNDARIO} onClick={() => setisPopupOpen(true)}>
												<Icone iconName="BookmarkPlusFill" type={COMMON_TYPES.INVERSO} />
											</Botao>
										)}
										{(utilizadorAtual.id === Utils.convertoStrToInt(id) ||
											AuthorizorHelper.hasPermission(EnumConstants.ROLES.ADMIN.ID)) && (
											<Botao route={"editar"}>
												<Icone iconName="PencilFill" type={COMMON_TYPES.INVERSO} />
											</Botao>
										)}
										{AuthorizorHelper.hasPermission(EnumConstants.ROLES.ADMIN.ID) && (
											<Botao
												onClick={() => handleOpenConfirmacaoInativar()}
												variant={BUTTON_VARIANTS.PERIGO}
											>
												<Icone iconName="Hammer" type={COMMON_TYPES.INVERSO} />
											</Botao>
										)}
									</Row>
									<Row className="gap-3">
										<Authorizor requiredPermission={EnumConstants.ROLES.ADMIN.ID}>
											<ComboBox
												options={transformarDadosPerfil()}
												placeholder="Escolha o perfil..."
												handleChange={(e) => setselectPerfil(e)}
												value={selectPerfil}
												className="conta-combo-box"
											/>
											<ComboBox
												options={transformarDadosCentro()}
												placeholder="Escolha o centro..."
												handleChange={(e) => setselectCentro(e)}
												value={selectCentro}
												className="conta-combo-box"
											/>
										</Authorizor>
									</Row>
								</div>
							</div>
						</div>
					</>
				) : (
					<LoadingContent />
				)}
			</Contentor>
		</>
	);
}
