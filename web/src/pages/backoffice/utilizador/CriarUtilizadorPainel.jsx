import { ApiRequest } from "api";
import { Botao, CaixaTexto, ComboBox, Notificacao, Seletor } from "components";
import { REGEX } from "data/regex";
import { useLoading } from "hooks/useLoading";
import { useInput } from "hooks/useInput";
import { useEffect, useState } from "react";
import { Validador } from "utils/validator";

export function CriarUtilizadorPainel({ handleCreated }) {
	const formNome = useInput();
	const formSobrenome = useInput();
	const formEmail = useInput();
	const formCentro = useInput();
	const formPerfil = useInput();
	const formVerificado = useInput(false);
	const [dataPerfil, setdataPerfil] = useState(null);
	const [dataCentro, setdataCentro] = useState(null);
	const [erros, setErros] = useState({});
	const loading = useLoading();

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		loading.start();
		await fetchCentro();
		await fetchPerfil();
		loading.stop();
	}

	const fetchCentro = async () => {
		const response = await ApiRequest.listar("centro/simples");
		setdataCentro(response);
	};

	const fetchPerfil = async () => {
		const response = await ApiRequest.listar("perfil/simples");
		setdataPerfil(response);
	};

	if (!dataCentro || !dataPerfil) return;

	const transformarDadosCentro = () => {
		return dataCentro?.map((item) => ({
			value: item.id,
			label: item.centro,
		}));
	};

	const transformarDadosPerfil = () => {
		return dataPerfil?.map((item) => ({
			value: item.id,
			label: item.perfil,
		}));
	};

	const handleLogin = async () => {
		const esquema = {
			nome: { required: true, type: "string" },
			sobrenome: { required: true, type: "string" },
			email: { required: true, pattern: REGEX.EMAIL },
			centro: { required: true },
			perfil: { required: true },
		};

		const validador = new Validador(esquema);
		const data = {
			nome: formNome.value,
			sobrenome: formSobrenome.value,
			email: formEmail.value,
			centro: formCentro.value,
			verificado: formVerificado.value,
			perfil: formPerfil.value,
		};

		const validacao = validador.validar(data);
		setErros(validacao);
		if (!validador.isValido(validacao)) return;

		loading.start();
		const response = await ApiRequest.criar("utilizador", data);
		if (response) {
			Notificacao("Utilizador criado!");
			handleCreated();
		}
		loading.stop();
	};

	return (
		<>
			<div className="d-flex">
				<CaixaTexto
					className="mt-2 me-auto"
					handleChange={(e) => formNome.onChange(e)}
					value={formNome.value}
					isInvalid={erros.nome}
					label="Nome"
				/>
				<CaixaTexto
					className="mt-2 ms-auto"
					handleChange={(e) => formSobrenome.onChange(e)}
					value={formSobrenome.value}
					isInvalid={erros.sobrenome}
					label="Sobrenome"
				/>
			</div>
			<CaixaTexto
				className="mt-2"
				handleChange={(e) => formEmail.onChange(e)}
				value={formEmail.value}
				isInvalid={erros.email}
				label="Email"
			/>
			<div className="d-flex gap-3">
				<ComboBox
					className="mt-2"
					options={transformarDadosCentro()}
					placeholder="Escolha o centro..."
					handleChange={(e) => formCentro.setValue(e)}
					value={formCentro.value}
					isInvalid={erros.centro}
					label="Centro"
				/>
				<ComboBox
					className="mt-2"
					options={transformarDadosPerfil()}
					placeholder="Escolha o perfil..."
					handleChange={(e) => formPerfil.setValue(e)}
					value={formPerfil.value}
					isInvalid={erros.perfil}
					label="Perfil"
				/>
			</div>
			<Seletor label="Verificar" className="mt-2" handleChange={(e) => formVerificado.setValue(e)} value={formVerificado.value} />
			<Botao className="mt-4" onClick={handleLogin}>
				Adicionar
			</Botao>
		</>
	);
}
