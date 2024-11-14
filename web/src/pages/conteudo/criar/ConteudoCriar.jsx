import { ApiRequest } from "api";
import { CaixaTexto, DatePicker, ImageBox, ComboBox, Botao, Notificacao, Texto, Popup, Icone } from "components/index";
import { Classificacao } from "components/ui/controlosInterecao/classificacao/Classificacao";
import { COMMON_SIZES, COMMON_TYPES } from "data/data";
import { EnumConstants } from "data/enum.constants";
import { useLoading } from "hooks/useLoading";
import { useCurrentUser } from "hooks/useCurrentUser";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Utils } from "utils/utils";
import { Validador } from "utils/validator";
import { Row } from "components/ui/Row";
import { MapaComponent } from "components/ui/mapa/MapaComponent";

export function ConteudoCriar() {
	const { id } = useParams();
	const loading = useLoading();
	const utilizadorAtual = useCurrentUser();
	const navigate = useNavigate();

	const [formTitulo, setformTitulo] = useState("");
	const [formDescricao, setformDescricao] = useState("");
	const [formImagem, setformImagem] = useState("");
	const [formEndereco, setformEndereco] = useState("");
	const [formLatitude, setformLatitude] = useState("");
	const [formLongitude, setformLongitude] = useState("");
	const [formSubtopico, setformSubtopico] = useState("");
	const [dataSubtopico, setdataSubtopico] = useState(null);

	const [formDataEvento, setformDataEvento] = useState("");
	const [formPreco, setformPreco] = useState("");
	const [formClassificacao, setformClassificacao] = useState("");

	const [erros, setErros] = useState({});

	const [isOpen, setisOpen] = useState(false);
	const [dataCoords, setdataCoords] = useState(null);

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		setformLatitude(dataCoords?.position?.lat);
		setformLongitude(dataCoords?.position?.lng);
		setformEndereco(dataCoords?.address);
	}, [dataCoords]);

	const fetchData = async () => {
		loading.start();
		await fetchSubtopico();
		loading.stop();
	};

	const fetchSubtopico = async () => {
		const response = await ApiRequest.listar("subtopico/simples");
		setdataSubtopico(response);
	};

	const handleRecomendacaoSubmit = async () => {
		const esquema = {
			imagem: { required: true },
			titulo: { required: true },
			descricao: { required: true },
			endereco: { required: true },
			subtopico: { required: true },
			classificacao: { required: true },
			preco: { required: true },
		};

		const validador = new Validador(esquema);
		const data = {
			classificacao: formClassificacao,
			preco: formPreco,
			imagem: formImagem,
			titulo: formTitulo,
			descricao: formDescricao,
			endereco: formEndereco,
			latitude: formLatitude,
			longitude: formLongitude,
			subtopico: formSubtopico,
			utilizador: utilizadorAtual.id,
			tipo: id,
		};

		const validacao = validador.validar(data);
		setErros(validacao);
		if (!validador.isValido(validacao)) return;

		await handleSubmit(data);
	};

	const handleEspacoSumbit = async () => {
		const esquema = {
			imagem: { required: true },
			titulo: { required: true },
			descricao: { required: true },
			endereco: { required: true },
			subtopico: { required: true },
		};

		const validador = new Validador(esquema);
		const data = {
			imagem: formImagem,
			titulo: formTitulo,
			descricao: formDescricao,
			endereco: formEndereco,
			latitude: formLatitude,
			longitude: formLongitude,
			subtopico: formSubtopico,
			utilizador: utilizadorAtual.id,
			tipo: id,
		};

		const validacao = validador.validar(data);
		setErros(validacao);
		if (!validador.isValido(validacao)) return;

		await handleSubmit(data);
	};

	const handleAtividadeSumbit = async () => {
		const esquema = {
			imagem: { required: true },
			titulo: { required: true },
			descricao: { required: true },
			endereco: { required: true },
			data_evento: { required: true },
			subtopico: { required: true },
		};

		const validador = new Validador(esquema);
		const data = {
			imagem: formImagem,
			titulo: formTitulo,
			descricao: formDescricao,
			endereco: formEndereco,
			latitude: formLatitude,
			longitude: formLongitude,
			data_evento: formDataEvento,
			subtopico: formSubtopico,
			utilizador: utilizadorAtual.id,
			tipo: id,
		};

		const validacao = validador.validar(data);
		setErros(validacao);
		if (!validador.isValido(validacao)) return;

		await handleSubmit(data);
	};

	const handleSubmit = async (data) => {
		loading.start();
		const response = await ApiRequest.criar_with_files("conteudo", data, "imagem");
		if (response) {
			Notificacao("Conteudo criado!");
			navigate(`/conteudos/${response.conteudo.id}`);
			window.location.reload();
		}
		loading.stop();
	};

	if (!dataSubtopico) return;

	const transformarDadosSubtopico = () => {
		return dataSubtopico?.map((item) => ({
			value: item.id,
			label: item.area,
		}));
	};

	const handleSelectPopup = () => {
		setisOpen(true);
	};

	return (
		<>
			{isOpen && (
				<Popup
					headerTitle={"Selecione o endereço"}
					onClose={() => setisOpen(false)}
					body={<MapaComponent handleChange={setdataCoords} setisOpen={setisOpen} />}
				/>
			)}
			<Texto size={COMMON_SIZES.FS4}>Criar {Utils.getTipoById(id)}</Texto>
			<CaixaTexto
				className="mt-2 me-auto"
				handleChange={(e) => setformTitulo(e.target.value)}
				value={formTitulo}
				isInvalid={erros.titulo}
				label="Título"
				placeholder="Título"
			/>
			<CaixaTexto
				className="mt-2 me-auto"
				handleChange={(e) => setformDescricao(e.target.value)}
				value={formDescricao}
				isInvalid={erros.descricao}
				label="Descrição"
				placeholder="Descrição"
			/>
			<Row className="gap-3">
				<CaixaTexto
					className="mt-2"
					handleChange={(e) => setformEndereco(e.target.value)}
					value={formEndereco}
					isInvalid={erros.endereco}
					label="Endereço"
					disabled={true}
				/>
				<Botao className="mt-2" onClick={() => handleSelectPopup()} label="Endereço">
					<Icone iconName="Search" type={COMMON_TYPES.INVERSO} />
				</Botao>
			</Row>
			<ComboBox
				className="mt-2"
				options={transformarDadosSubtopico()}
				placeholder="Escolha o perfil..."
				handleChange={(e) => setformSubtopico(e)}
				value={formSubtopico}
				isInvalid={erros.subtopico}
				label="Subtopico"
			/>
			{(Utils.convertoStrToInt(id) === EnumConstants.CONTEUDO_TIPOS.ATIVIDADE.ID ||
				Utils.convertoStrToInt(id) === EnumConstants.CONTEUDO_TIPOS.EVENTO.ID) && (
				<DatePicker
					className="mt-2 ms-auto"
					handleChange={(e) => setformDataEvento(e.target.value)}
					value={formDataEvento}
					isInvalid={erros.data_evento}
					label={"Data"}
				/>
			)}
			{Utils.convertoStrToInt(id) === EnumConstants.CONTEUDO_TIPOS.RECOMENDACAO.ID && (
				<>
					<CaixaTexto
						className="mt-2 ms-auto"
						handleChange={(e) => setformPreco(e.target.value)}
						value={formPreco}
						isInvalid={erros.preco}
						label="Preço"
						type="number"
					/>
					<div className="mt-2 ms-auto">
						Classificação
						<Classificacao value={formClassificacao} handleChange={setformClassificacao} />
						{erros.classificacao ? (
							<Texto size={COMMON_SIZES.FS0} type={COMMON_TYPES.PERIGO}>
								{erros.classificacao}
							</Texto>
						) : null}
					</div>
				</>
			)}
			<div className="mt-2 ms-auto">
				Imagem
				<ImageBox handleChange={setformImagem} />
			</div>
			{(Utils.convertoStrToInt(id) === EnumConstants.CONTEUDO_TIPOS.ATIVIDADE.ID ||
				Utils.convertoStrToInt(id) === EnumConstants.CONTEUDO_TIPOS.EVENTO.ID) && (
				<Botao className="mt-4" onClick={handleAtividadeSumbit}>
					Adicionar
				</Botao>
			)}
			{Utils.convertoStrToInt(id) === EnumConstants.CONTEUDO_TIPOS.RECOMENDACAO.ID && (
				<Botao className="mt-4" onClick={handleRecomendacaoSubmit}>
					Adicionar
				</Botao>
			)}
			{Utils.convertoStrToInt(id) === EnumConstants.CONTEUDO_TIPOS.ESPACO.ID && (
				<Botao className="mt-4" onClick={handleEspacoSumbit}>
					Adicionar
				</Botao>
			)}
		</>
	);
}
