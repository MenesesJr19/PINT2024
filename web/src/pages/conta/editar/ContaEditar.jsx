import { ApiRequest } from "api";
import { Botao, CaixaTexto, ImageBox, Notificacao } from "components";
import { useLoading } from "hooks/useLoading";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCurrentUser } from "hooks/useCurrentUser";
import { Validador } from "utils/validator";
import { Utils } from "utils/utils";
import { ImagemUtilizador } from "components/common/imagem/ImagemUtilizador";
import { EnumConstants } from "data/enum.constants";

export function ContaEditar() {
	const { id } = useParams();
	const loading = useLoading();
	const { userData, isValid } = useCurrentUser(true);
	const navigate = useNavigate();
	const [erros, setErros] = useState([]);

	const [dataConta, setdataConta] = useState(null);
	const [newImagens, setnewImagens] = useState([]);
	const [formNome, setformNome] = useState([]);
	const [formSobrenome, setformSobrenome] = useState([]);
	const [formLinkedin, setformLinkedin] = useState([]);
	const [formInstagram, setformInstagram] = useState([]);
	const [formFacebook, setformFacebook] = useState([]);

	useEffect(() => {
		if (!isValid) return;
		if (userData.id !== Utils.convertoStrToInt(id) && userData.perfil !== EnumConstants.ROLES.ADMIN.ID) {
			navigate("/");
		}
	}, [userData, isValid, id]);

	useEffect(() => {
		if (!dataConta) return;
		setnewImagens(dataConta.imagem);
		setformNome(dataConta.nome);
		setformSobrenome(dataConta.sobrenome);
		setformLinkedin(dataConta.linkedin);
		setformInstagram(dataConta.instagram);
		setformFacebook(dataConta.facebook);
	}, [dataConta]);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		loading.start();
		await fetchContaData();
		loading.stop();
	};

	const fetchContaData = async () => {
		const data = await ApiRequest.obter("utilizador/simples", id);
		setdataConta(data);
	};

	const handleImageUpload = async () => {
		const esquema = {
			imagem: { required: true },
		};

		const validador = new Validador(esquema);
		const data = {
			imagem: newImagens,
		};

		const validacao = validador.validar(data);
		setErros(validacao);
		if (!validador.isValido(validacao)) return;

		loading.start();
		await ApiRequest.upload_user_image(id, newImagens);
		Notificacao("Atualiza com sucesso!");
		await fetchData();
		loading.stop();
	};

	const handleDataAtualizar = async () => {
		const esquema = {
			nome: { required: true },
			sobrenome: { required: true },
		};

		const validador = new Validador(esquema);
		const data = {
			nome: formNome,
			sobrenome: formSobrenome,
			linkedin: formLinkedin,
			instagram: formInstagram,
			facebook: formFacebook,
		};

		const validacao = validador.validar(data);
		setErros(validacao);
		if (!validador.isValido(validacao)) return;

		loading.start();
		await ApiRequest.atualizar("utilizador", id, data);
		Notificacao("Atualiza com sucesso!");
		await fetchData();
		loading.stop();
	};

	if (!dataConta || !userData) return;

	return (
		<>
			<div>
				<ImagemUtilizador src={newImagens} className="image-size circular-image" />
				<div className="d-flex">
					<ImageBox handleChange={setnewImagens} />
					<Botao onClick={handleImageUpload}>Upload</Botao>
				</div>
			</div>
			<div>
				<CaixaTexto
					className="mt-2 me-auto"
					handleChange={(e) => setformNome(e.target.value)}
					value={formNome}
					isInvalid={erros.nome}
					label="Nome"
				/>
				<CaixaTexto
					className="mt-2 me-auto"
					handleChange={(e) => setformSobrenome(e.target.value)}
					value={formSobrenome}
					isInvalid={erros.sobrenome}
					label="Sobrenome"
				/>
				<CaixaTexto
					className="mt-2 me-auto"
					handleChange={(e) => setformLinkedin(e.target.value)}
					value={formLinkedin}
					isInvalid={erros.linkedin}
					label="Linkedin"
				/>
				<CaixaTexto
					className="mt-2 me-auto"
					handleChange={(e) => setformFacebook(e.target.value)}
					value={formFacebook}
					isInvalid={erros.facebook}
					label="Facebook"
				/>
				<CaixaTexto
					className="mt-2 me-auto"
					handleChange={(e) => setformInstagram(e.target.value)}
					value={formInstagram}
					isInvalid={erros.instagram}
					label="Instagram"
				/>
				<Botao onClick={handleDataAtualizar} className="mt-2 me-auto">
					Atualizar
				</Botao>
			</div>
		</>
	);
}
