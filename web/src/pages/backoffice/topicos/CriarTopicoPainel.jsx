import { ApiRequest } from "api";
import { Botao, CaixaTexto, ComboBox, Notificacao } from "components";
import { REGEX } from "data/regex";
import { useLoading } from "hooks/useLoading";
import { useEffect, useState } from "react";
import { Validador } from "utils/validator";

export function CriarTopicoPainel({ handleCreated }) {
	const [formTopico, setFormTopico] = useState("");
	const [erros, setErros] = useState({});
	const loading = useLoading();

	const handleAdicionar = async () => {
		const esquema = { topico: { required: true } };
		const validador = new Validador(esquema);
		const data = { topico: formTopico };

		const validacao = validador.validar(data);
		setErros(validacao);
		if (!validador.isValido(validacao)) return;

		loading.start();
		const response = await ApiRequest.criar("topico", data);
		if (response) {
			Notificacao("Tópico criado!");
			handleCreated();
		}
		loading.stop();
	};

	return (
		<>
			<CaixaTexto
				className="mt-2"
				handleChange={(e) => setFormTopico(e.target.value)}
				value={formTopico}
				isInvalid={erros.topico}
				label="Tópico"
			/>
			<Botao className="mt-4" onClick={handleAdicionar}>
				Adicionar
			</Botao>
		</>
	);
}
