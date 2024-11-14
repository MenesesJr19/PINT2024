import { AutenticacaoRequest } from "api";
import { ApiRequest } from "api/apiRequest";
import { Comentario, CaixaTexto, Texto, Botao } from "components/index";
import { COMMON_SIZES } from "data/data";
import { useCurrentUser } from "hooks/useCurrentUser";
import { useLoading } from "hooks/useLoading";
import { useEffect, useState } from "react";
import { Popup } from "react-leaflet";
import { DenunciaMotivoPopup } from "./DenunciaMotivoPopup";

export function ComentarioSeccao({ id }) {
	const [dataComentarios, setdataComentarios] = useState(null);
	const [novoComentario, setnovoComentario] = useState("");
	const loading = useLoading();
	const utilizadorAtual = useCurrentUser();
	const [isOpen, setisOpen] = useState(false);
	const [popupDenunciaId, setpopupDenunciaId] = useState();

	useEffect(() => {
		loading.start();
		fetchComentariosData();
		loading.stop();
	}, []);

	useEffect(() => {
		const hash = window.location.hash;
		if (hash) {
			const element = document.getElementById(hash.substring(1));
			if (element) {
				element.scrollIntoView({ behavior: "smooth" });
			}
		}
	}, [dataComentarios]);

	const fetchComentariosData = async () => {
		const data = await ApiRequest.listar("comentario", { conteudo: id });
		setdataComentarios(data);
	};

	if (!dataComentarios) return;

	const handleEnviarComentario = async () => {
		await ApiRequest.criar("comentario", {
			comentario: novoComentario,
			conteudo: id,
			utilizador: utilizadorAtual.id,
		});
		fetchComentariosData();
		setnovoComentario("");
	};

	const handleNewComentarioChange = (e) => {
		setnovoComentario(e.target.value);
	};

	const commentItems = (id) => {
		return [{ nome: "Denunciar", onclick: () => handleDenuncia(id) }];
	};

	const handleDenuncia = (id_comentario) => {
		setpopupDenunciaId(id_comentario);
		setisOpen(true);
	};

	return (
		<div className="conteudo-detalhe-comentario">
			<DenunciaMotivoPopup utilizadorAtual={utilizadorAtual} id={popupDenunciaId} isPopupOpen={isOpen} setisPopupOpen={() => setisOpen()} />
			<Texto size={COMMON_SIZES.FS4}>Comentário ({dataComentarios.length})</Texto>
			<div className="align-items-center gap-2 mb-3">
				<CaixaTexto
					placeholder="Adicione um comentário..."
					value={novoComentario}
					handleChange={handleNewComentarioChange}
					handleSubmit={() => handleEnviarComentario()}
				/>
			</div>
			{dataComentarios.map((comentario, _) => (
				<div key={comentario.id} id={`comentario-${comentario.id}`} className="mb-2">
					<Comentario
						key={comentario.id}
						utilizador={comentario.comentario_utilizador}
						comentario={comentario}
						dropdownItems={commentItems(comentario.id)}
					/>
				</div>
			))}
		</div>
	);
}
