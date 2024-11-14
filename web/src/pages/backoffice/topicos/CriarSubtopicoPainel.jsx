import { ApiRequest } from "api";
import { Botao, CaixaTexto, ComboBox, Notificacao } from "components";
import { REGEX } from "data/regex";
import { useLoading } from "hooks/useLoading";
import { useEffect, useState } from "react";
import { Validador } from "utils/validator";

export function CriarSubtopicoPainel({ handleCreated }) {
	const [formSubtopico, setFormSubtopico] = useState("");
	const [formTopico, setFormTopico] = useState("");
	const [dataTopico, setdataTopico] = useState(null);
	const [erros, setErros] = useState({});
	const loading = useLoading();

	useEffect(() => {
		fetchCentro();
	}, []);

	const fetchCentro = async () => {
		loading.start();
		const response = await ApiRequest.listar("topico/simples");
		setdataTopico(response);
		loading.stop();
	};

	if (!dataTopico) return;

	const transformarDados = () => {
		return dataTopico?.map((item) => ({
			value: item.id,
			label: item.topico,
		}));
	};

	const handleLogin = async () => {
		const esquema = {
			topico: { required: true },
			area: { required: true },
		};

		const validador = new Validador(esquema);
		const data = { topico: formTopico, area: formSubtopico };

		const validacao = validador.validar(data);
		setErros(validacao);
		if (!validador.isValido(validacao)) return;

		loading.start();
		const response = await ApiRequest.criar("subtopico", data);
		if (response) {
			Notificacao("Subtópico criado!");
			handleCreated();
		}
		loading.stop();
	};

	return (
		<>
			<CaixaTexto
				className="mt-2"
				handleChange={(e) => setFormSubtopico(e.target.value)}
				value={formSubtopico}
				isInvalid={erros.subtopico}
				label="Subtópico"
			/>
			<ComboBox
				className="mt-2"
				options={transformarDados()}
				placeholder="Escolha o tópico..."
				handleChange={(e) => setFormTopico(e)}
				value={formTopico}
				isInvalid={erros.topico}
				label="Tópico"
			/>
			<Botao className="mt-4" onClick={handleLogin}>
				Adicionar
			</Botao>
		</>
	);
}
