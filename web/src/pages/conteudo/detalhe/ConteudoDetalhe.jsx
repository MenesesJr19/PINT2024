import {
	Texto,
	PequenoPerfil,
	Imagem,
	Botao,
	ControlosInteracao,
	Rotulo,
	Icone,
	Confirmacao,
	Popup,
	Notificacao,
} from "components/index";
import { useEffect, useState } from "react";
import { Album } from "./Album";
import { ComentarioSeccao } from "./ComentarioSeccao";
import { BUTTON_VARIANTS, COMMON_SIZES, COMMON_TYPES } from "data/data";
import "./conteudo-detalhe.css";
import { ImagemModal } from "components/overlay/imagemModal/ImagemModal";
import { useLoading } from "hooks/useLoading";
import { Link, useParams } from "react-router-dom";
import { DateUtils } from "utils/date.utils";
import { LabelError } from "layouts/labelWarnings/LabelError";
import { EnumConstants } from "data/enum.constants";
import { DBUtils } from "utils/db.utils";
import { ApiRequest } from "api/apiRequest";
import { LabelSucess } from "layouts/labelWarnings/LabelSucess";
import { useCurrentUser } from "hooks/useCurrentUser";
import { useConfirmation } from "hooks/useConfirmation";
import { myAxios } from "api";
import { EditarConteudo } from "./EditarConteudo";
import { AuthorizorHelper } from "components/helpers/AuthorizorHelper";

export function ConteudoDetalhe() {
	const [dataDetalhe, setdataDetalhe] = useState(null);
	const [isAdminCentro, setisAdminCentro] = useState(true);
	const [isRevisao, setisRevisao] = useState(true);
	const [isRejeitado, setisRejeitado] = useState(true);
	const [isPopupOpen, setisPopupOpen] = useState(false);
	const [isSubscribed, setisSubscribed] = useState(false);
	const loading = useLoading();
	const { conCreate, conSet, conOpen } = useConfirmation();
	const { id } = useParams();
	const { userData, isValid } = useCurrentUser(true);

	useEffect(() => {
		if (dataDetalhe) {
			setisSubscribed(DBUtils.checkParticipanteInConteudo(dataDetalhe.participante_conteudo, userData.id));
		}
	}, [dataDetalhe, userData]);

	useEffect(() => {
		fetchConteudoData();
	}, []);

	useEffect(() => {
		if (dataDetalhe && userData) {
			setisRevisao(dataDetalhe.revisao_conteudo.length > 0 ? DBUtils.checkRevisao(dataDetalhe.revisao_conteudo) : true);
			setisRejeitado(DBUtils.checkRevisaoRejeitado(dataDetalhe.revisao_conteudo));
			setisAdminCentro(DBUtils.checkAdminCentro(dataDetalhe.conteudo_utilizador, userData.centro));
		}
	}, [dataDetalhe, userData]);

	const fetchConteudoData = async () => {
		loading.start();
		const data = await ApiRequest.obter("conteudo", id);
		setdataDetalhe(data);
		loading.stop();
	};

	if (!dataDetalhe || !isValid) return;

	const handleAddParticipacao = async () => {
		loading.start();
		await ApiRequest.criar("participante", { utilizador: userData.id, conteudo: id });
		await fetchConteudoData();
	};

	const handleRemoverParticipacao = async () => {
		loading.start();
		await myAxios({ url: "participante/remover", method: "post", data: { utilizador: userData.id, conteudo: id } });
		await fetchConteudoData();
	};

	const handleRevisaoAprovada = async () => {
		if (dataDetalhe.revisao_conteudo.length > 0)
			await ApiRequest.atualizar("revisao", dataDetalhe.revisao_conteudo[0].id, {
				estado: EnumConstants.ESTADOS.APROVADO,
			});
		else await ApiRequest.criar("revisao", { conteudo: id, estado: EnumConstants.ESTADOS.APROVADO });
		fetchConteudoData();
	};

	const handleRevisaoRejeitada = async () => {
		if (dataDetalhe.revisao_conteudo.length > 0)
			await ApiRequest.atualizar("revisao", dataDetalhe.revisao_conteudo[0].id, {
				estado: EnumConstants.ESTADOS.REJEITADO,
			});
		else await ApiRequest.criar("revisao", { conteudo: id, estado: EnumConstants.ESTADOS.REJEITADO });

		fetchConteudoData();
	};

	const handleRevisionPopup = () => {
		conSet({
			title: "Rever conteudo",
			body: "O que deseja fazer?",
			successLabel: "Aceitar",
			errorLabel: "Rejeitar",
			onSuccess: handleRevisaoAprovada,
			onError: handleRevisaoRejeitada,
		});
		conOpen();
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

	const handleCopyLink = () => {
		const url = window.location.href;
		navigator.clipboard
			.writeText(url)
			.then(() => {
				Notificacao("Link copiado para a área de transferência!", "info");
			})
			.catch((err) => {
				Notificacao("Algo correu mal!", "error");
			});
	};

	return (
		<div>
			{isPopupOpen && (
				<Popup
					headerTitle={"Atualizar conteudo"}
					onClose={() => closePopup()}
					body={<EditarConteudo handleCreated={() => handleCreated()} />}
				/>
			)}
			{conCreate()}
			{isRevisao && <LabelError texto="Em revisão..." />}
			{isRejeitado && <LabelError texto="Conteudo foi rejeitado" />}
			{isSubscribed && <LabelSucess texto="Você está inscrito!" />}
			<div className="AtividadeDetalhe" id={dataDetalhe.id}>
				<section className="conteudo-detalhe-conteudo">
					<div className="conteudo-detalhe-info">
						<PequenoPerfil
							id={dataDetalhe.conteudo_utilizador.id}
							imagem={dataDetalhe.conteudo_utilizador.imagem}
							nome={dataDetalhe.conteudo_utilizador.nome + " " + dataDetalhe.conteudo_utilizador.sobrenome}
							data={DateUtils.DataRelativa(dataDetalhe.data_criacao)}
						/>
					</div>
					<div className="conteudo-detalhe-titulo">
						<Texto size={COMMON_SIZES.FS3} className="">
							{dataDetalhe.titulo}
						</Texto>
					</div>
					<div className="conteudo-detalhe-descricao">
						<Texto className="">{dataDetalhe.descricao}</Texto>
					</div>
					{dataDetalhe.imagem && (
						<div className="imagem-container">
							<ImagemModal imagemSelecionada={dataDetalhe.imagem} description={dataDetalhe.titulo}>
								<Imagem
									src={dataDetalhe.imagem}
									className="conteudo-detalhe-imagem"
									style={{ objectFit: "cover" }}
								/>
							</ImagemModal>
						</div>
					)}
					<div className="conteudo-detalhe-botoes"></div>
				</section>
				<section className="conteudo-detalhe-informacoes">
					<div className="gap-2 d-flex mt-3 mb-2">
						<Rotulo
							info={dataDetalhe.conteudo_tipo.tipo}
							backgroundColor={"gold"}
							textColor={COMMON_TYPES.PRIMARIO}
						/>
						<Rotulo info={dataDetalhe.conteudo_subtopico.subtopico_topico.topico} />
						<Rotulo info={dataDetalhe.conteudo_subtopico.area} />
					</div>
					{dataDetalhe.preco && (
						<div>
							<strong>Preço:</strong> {dataDetalhe.preco}
						</div>
					)}
					{dataDetalhe.classificacao && (
						<div>
							<strong>Classificação:</strong> {dataDetalhe.classificacao}
						</div>
					)}
					<Texto>
						<strong>Endereço:</strong> {dataDetalhe.endereco}
						<Link style={{ marginLeft: "10px" }} to={`/mapa/${dataDetalhe.id}`}>
							<Icone iconName="PinMap" className="icon-hover align-self-center" />
						</Link>
					</Texto>
					<div className="mt-3">
						<Album id={id} />
					</div>
				</section>
			</div>
			<div className="conteudo-detalhe-interacoes">
				<section>
					<ControlosInteracao
						conteudo_id={id}
						utilizador_atual={userData}
						defaultValue={dataDetalhe?.classificacao_conteudo}
					/>
				</section>
				<section className="d-flex gap-2 mt-2">
					{(dataDetalhe.tipo === EnumConstants.CONTEUDO_TIPOS.ATIVIDADE.ID ||
						dataDetalhe.tipo === EnumConstants.CONTEUDO_TIPOS.EVENTO.ID) &&
						(!isSubscribed ? (
							<Botao onClick={handleAddParticipacao} variant={BUTTON_VARIANTS.SUCESSO}>
								Participar
							</Botao>
						) : (
							<Botao onClick={handleRemoverParticipacao} variant={BUTTON_VARIANTS.SECUNDARIO}>
								Remover Participação
							</Botao>
						))}
					{isRevisao && (
						<Botao variant={BUTTON_VARIANTS.PRIMARIO} onClick={() => openPopup()}>
							Editar
						</Botao>
					)}
					{AuthorizorHelper.hasPermission(EnumConstants.ROLES.ADMIN.ID) && isAdminCentro && (
						<Botao variant={BUTTON_VARIANTS.PERIGO} onClick={() => handleRevisionPopup()}>
							Rever
						</Botao>
					)}
					<Botao variant={BUTTON_VARIANTS.SECUNDARIO} onClick={() => handleCopyLink()}>
						Copiar Link
					</Botao>
				</section>
				<section>
					<ComentarioSeccao id={id} />
				</section>
			</div>
		</div>
	);
}
