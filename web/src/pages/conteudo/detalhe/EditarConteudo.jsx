import { ApiRequest } from "api";
import { Botao, CaixaTexto, ComboBox, FileBox, Notificacao, Seletor } from "components";
import { REGEX } from "data/regex";
import { useLoading } from "hooks/useLoading";
import { useInput } from "hooks/useInput";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Validador } from "utils/validator";

export function EditarConteudo({ handleCreated }) {
	const formTitulo = useInput();
	const formDescricao = useInput();
	const formSubtopico = useInput();
	const formRemoverImagem = useInput();
	const [dataSubtopico, setdataSubtopico] = useState(null);
	const [dataConteudo, setdataConteudo] = useState(null);
	const [erros, setErros] = useState({});
	const loading = useLoading();
	const { id } = useParams();

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		if (!dataConteudo) return;
		formTitulo.setValue(dataConteudo.titulo);
		formDescricao.setValue(dataConteudo.descricao);
		formSubtopico.setValue(dataConteudo.subtopico);
	}, [dataConteudo]);

	const fetchData = async () => {
		loading.start();
		await fetchSubtopico();
		await fetchConteudo();
		loading.stop();
	};

	const fetchSubtopico = async () => {
		const response = await ApiRequest.listar("subtopico/simples");
		setdataSubtopico(response);
	};

	const fetchConteudo = async () => {
		const response = await ApiRequest.obter("conteudo/simples", id);
		setdataConteudo(response);
	};


	if (!dataSubtopico) return;

	const transformarDadosSubtopico = () => {
		return dataSubtopico?.map((item) => ({
			value: item.id,
			label: item.area,
		}));
	};

	const handleLogin = async () => {
		const esquema = {
			titulo: { required: true },
			descricao: { required: true },
			subtopico: { required: true },
		};

		const validador = new Validador(esquema);
		const data = {
			titulo: formTitulo.value,
			descricao: formDescricao.value,
			subtopico: formSubtopico.value,
		};
		if (formRemoverImagem.value) data.imagem = "";

		const validacao = validador.validar(data);
		setErros(validacao);
		if (!validador.isValido(validacao)) return;

		loading.start();
		const response = await ApiRequest.atualizar("conteudo", id, data);
		if (response) {
			Notificacao("Conteudo editado!");
			handleCreated();
		}
		loading.stop();
	};

	return (
		<>
			<CaixaTexto
				className="mt-2 me-auto"
				handleChange={(e) => formTitulo.onChange(e)}
				value={formTitulo.value}
				isInvalid={erros.titulo}
				label="Título"
			/>
			<CaixaTexto
				className="mt-2 ms-auto"
				handleChange={(e) => formDescricao.onChange(e)}
				value={formDescricao.value}
				isInvalid={erros.descricao}
				label="Descrição"
			/>
			<ComboBox
				className="mt-2"
				options={transformarDadosSubtopico()}
				placeholder="Escolha o subtopico..."
				handleChange={(e) => formSubtopico.setValue(e)}
				value={formSubtopico.value}
				isInvalid={erros.subtopico}
				label="Subtópico"
			/>
			<Seletor
				label="Remover Imagem"
				className="mt-2"
				handleChange={(e) => formRemoverImagem.setValue(e)}
				value={formRemoverImagem.value}
			/>
			<Botao className="mt-4" onClick={handleLogin}>
				Adicionar
			</Botao>
		</>
	);
}
