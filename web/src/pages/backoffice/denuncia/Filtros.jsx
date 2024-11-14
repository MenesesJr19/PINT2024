import { ApiRequest } from "api";
import { Botao, CaixaTexto, ComboBox } from "components";
import { COMBOBOX_DEFAULT_VALUE } from "data/constants";
import { BUTTON_VARIANTS } from "data/data";
import { useLoading } from "hooks/useLoading";
import { useInput } from "hooks/useInput";
import { useEffect, useState } from "react";
import { Utils } from "utils/utils";

export function Filtros({ data, setFiltered }) {
	const searchUser = useInput();
	const searchEstado = useInput(0);
	const [dataEstado, setdataEstado] = useState(null);
	const loading = useLoading();

	const filterData = () => {
		let filteredData = data;
		if (searchUser.value) {
			const searchValue = searchUser.value.toLowerCase();
			filteredData = filteredData.filter(
				(user) =>
					user.motivo.toLowerCase().includes(searchValue) ||
					user.denuncia_estado.estado.toLowerCase().includes(searchValue) ||
					user.denuncia_comentario.comentario.toLowerCase().includes(searchValue) ||
					user.denuncia_comentario.comentario_utilizador.tag.toLowerCase().includes(searchValue)
			);
		}

		if (Utils.convertoStrToInt(searchEstado.value) !== COMBOBOX_DEFAULT_VALUE) {
			const searchValue = Utils.convertoStrToInt(searchEstado.value);
			filteredData = filteredData.filter((user) => user.estado === searchValue);
		}

		setFiltered(filteredData);
	};

	useEffect(() => {
		if (data) filterData();
	}, [searchUser.value, searchEstado.value, data]);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		loading.start();
		await fetchEstado();
		loading.stop();
	};

	const fetchEstado = async () => {
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
		searchUser.setValue("");
	};

	if (!dataEstado) return;

	return (
		<>
			<CaixaTexto
				className="mt-2 me-auto"
				handleChange={(e) => searchUser.onChange(e)}
				value={searchUser.value}
				placeholder="Pesquisar utilizador..."
			/>
			<div className="d-flex align-items-center gap-3">
				<ComboBox
					className="mt-2"
					options={transformarDadosEstado()}
					placeholder="Escolha o perfil..."
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
