import { ApiRequest } from "api";
import { Botao, CaixaTexto, ComboBox } from "components";
import { COMBOBOX_DEFAULT_VALUE } from "data/constants";
import { BUTTON_VARIANTS } from "data/data";
import { useLoading } from "hooks/useLoading";
import { useInput } from "hooks/useInput";
import { useEffect, useState } from "react";
import { Utils } from "utils/utils";

export function Filtros({ data, filtered, setFiltered }) {
	const searchUser = useInput();
	const searchCentro = useInput(0);
	const searchPerfil = useInput(0);
	const [dataPerfil, setdataPerfil] = useState(null);
	const [dataCentro, setdataCentro] = useState(null);
	const loading = useLoading();

	const filterData = () => {
		let filteredData = data;
		if (searchUser.value) {
			const searchValue = searchUser.value.toLowerCase();
			filteredData = filteredData.filter(
				(user) =>
					user.nome.toLowerCase().includes(searchValue) ||
					user.sobrenome.toLowerCase().includes(searchValue) ||
					user.tag.toLowerCase().includes(searchValue) ||
					user.email.toLowerCase().includes(searchValue)
			);
		}

		if (Utils.convertoStrToInt(searchCentro.value) !== COMBOBOX_DEFAULT_VALUE) {
			const searchValue = Utils.convertoStrToInt(searchCentro.value);
			filteredData = filteredData.filter((user) => user.centro === searchValue);
		}

		if (Utils.convertoStrToInt(searchPerfil.value) !== COMBOBOX_DEFAULT_VALUE) {
			const searchValue = Utils.convertoStrToInt(searchPerfil.value);
			filteredData = filteredData.filter((user) => user.perfil === searchValue);
		}

		setFiltered(filteredData);
	};

	useEffect(() => {
		if (data) {
			filterData();
		}
	}, [searchUser.value, searchCentro.value, searchPerfil.value, data]);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		loading.start();
		await fetchCentro();
		await fetchPerfil();
		loading.stop();
	};

	const fetchCentro = async () => {
		const response = await ApiRequest.listar("centro/simples");
		setdataCentro(response);
	};

	const fetchPerfil = async () => {
		const response = await ApiRequest.listar("perfil/simples");
		setdataPerfil(response);
	};

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

	const handleCleanFilters = () => {
		searchCentro.setValue(COMBOBOX_DEFAULT_VALUE);
		searchPerfil.setValue(COMBOBOX_DEFAULT_VALUE);
		searchUser.setValue("");
	};

	if (!dataCentro || !dataPerfil) return;

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
					options={transformarDadosCentro()}
					placeholder="Escolha o centro..."
					handleChange={(e) => searchCentro.setValue(e)}
					value={searchCentro.value}
				/>
				<ComboBox
					className="mt-2"
					options={transformarDadosPerfil()}
					placeholder="Escolha o perfil..."
					handleChange={(e) => searchPerfil.setValue(e)}
					value={searchPerfil.value}
				/>
				<Botao variant={BUTTON_VARIANTS.SECUNDARIO} onClick={() => handleCleanFilters()}>
					Limpar
				</Botao>
			</div>
		</>
	);
}
