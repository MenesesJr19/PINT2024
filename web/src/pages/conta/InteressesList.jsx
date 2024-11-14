import { ApiRequest } from "api";
import { Botao } from "components";
import { Categoria } from "components/container/categorias/Categoria";
import { useCurrentUser } from "hooks/useCurrentUser";
import { useLoading } from "hooks/useLoading";
import { useEffect, useState } from "react";

export function InteressesList({ id, onClose }) {
	const [dataSubtopicos, setdataSubtopicos] = useState(null);
	const [dataInteresses, setdataInteresses] = useState(null);
	const [selectedSubtopicos, setselectedSubtopicos] = useState(null);
	const loading = useLoading();
	const utilizadorAtual = useCurrentUser();

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		if (dataInteresses) getSelectedSubtopicos();
	}, [dataInteresses]);

	const fetchData = async () => {
		loading.start();
		await fetchSubtopicoData();
		await fetchUserInteressesData();
		loading.stop();
	};

	const fetchSubtopicoData = async () => {
		const data = await ApiRequest.listar("subtopico");
		setdataSubtopicos(data);
	};

	const fetchUserInteressesData = async () => {
		const data = await ApiRequest.listar("interesse", { utilizador: id });
		setdataInteresses(data);
	};

	const getSelectedSubtopicos = () => {
		const selInt = [];

		dataInteresses.forEach((interesse) => {
			selInt.push(interesse?.interesse_subtopico?.id);
		});

		setselectedSubtopicos(selInt);
	};

	if (!dataSubtopicos || !selectedSubtopicos || !dataSubtopicos) return;

	const handleCategoryClick = (isActive, id) => {
		if (isActive) {
			if (!selectedSubtopicos.includes(id)) {
				setselectedSubtopicos([...selectedSubtopicos, id]);
			}
		} else {
			setselectedSubtopicos(selectedSubtopicos.filter((item) => item !== id));
		}
	};

	const handleCreateInteresse = async () => {
		loading.start();
		await ApiRequest.criar("interesse", { subtopico: selectedSubtopicos, utilizador: utilizadorAtual.id });
		onClose();
		await fetchData();
		loading.stop();
	};

	return (
		<>
			<Botao onClick={() => handleCreateInteresse()}>Concluir</Botao>
			<div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
				{dataSubtopicos.map((interesse) => (
					<div className="me-1 mx-1 mt-1 mb-1">
						<Categoria
							id={interesse.id}
							category={interesse.area}
							value={selectedSubtopicos.includes(interesse.id)}
							handleChange={(isActive, id) => handleCategoryClick(isActive, id)}
						/>
					</div>
				))}
			</div>
		</>
	);
}
