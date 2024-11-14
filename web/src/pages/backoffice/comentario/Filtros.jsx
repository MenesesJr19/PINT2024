import { ApiRequest } from "api";
import { Botao, CaixaTexto, ComboBox } from "components";
import { COMBOBOX_DEFAULT_VALUE } from "data/constants";
import { BUTTON_VARIANTS } from "data/data";
import { useLoading } from "hooks/useLoading";
import { useInput } from "hooks/useInput";
import { useEffect, useState } from "react";
import { Utils } from "utils/utils";

export function Filtros({ data, setFiltered }) {
	const searchGeral = useInput();
	const searchEstado = useInput(0);
	const [dataEstado, setdataEstado] = useState(null);
	const loading = useLoading();

	const filterData = () => {
		let filteredData = data;
		if (searchGeral.value) {
			const searchValue = searchGeral.value.toLowerCase();
			filteredData = filteredData.filter(
				(user) =>
					user.comentario_utilizador.nome.toLowerCase().includes(searchValue) ||
					user.comentario_utilizador.sobrenome.toLowerCase().includes(searchValue) ||
					user.comentario_utilizador.tag.toLowerCase().includes(searchValue) ||
					user.revisao_comentario[0].revisao_estado.estado.toLowerCase().includes(searchValue) ||
					user.comentario.toLowerCase().includes(searchValue)
			);
		}

		if (Utils.convertoStrToInt(searchEstado.value) !== COMBOBOX_DEFAULT_VALUE) {
			const searchValue = Utils.convertoStrToInt(searchEstado.value);
			filteredData = filteredData.filter((user) => user.revisao_comentario[0].revisao_estado.id === searchValue);
		}

		setFiltered(filteredData);
	};

	useEffect(() => {
		if (data) {
			filterData();
		}
	}, [searchGeral.value, searchEstado.value, data]);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		loading.start();
		await fetchCentro();
		loading.stop();
	};

	const fetchCentro = async () => {
		const response = await ApiRequest.listar("estado/simples");
		setdataEstado(response);
	};

	const transformarDadosEstado = () => {
		return dataEstado?.map((item) => ({
			value: item.id,
			label: item.estado,
		}));
	};

	const handleCleanFilters = () => {
		searchEstado.setValue(COMBOBOX_DEFAULT_VALUE);
		searchGeral.setValue("");
	};

	if (!dataEstado) return;

	return (
		<>
			<CaixaTexto
				className="mt-2 me-auto"
				handleChange={(e) => searchGeral.onChange(e)}
				value={searchGeral.value}
				placeholder="Pesquisar utilizador..."
			/>
			<div className="d-flex align-items-center gap-3">
				<ComboBox
					className="mt-2"
					options={transformarDadosEstado()}
					placeholder="Escolha o estado..."
					handleChange={(e) => searchEstado.setValue(e)}
					value={searchEstado.value}
				/>
				<Botao variant={BUTTON_VARIANTS.SECUNDARIO} onClick={() => handleCleanFilters()}>
					Limpar
				</Botao>
			</div>
		</>
	);
}
