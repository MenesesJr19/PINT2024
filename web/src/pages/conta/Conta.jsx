import { ContaPrincipal } from "./blocos/ContaPrincipal";
import { useEffect, useState } from "react";
import { useLoading } from "hooks/useLoading";
import { useParams } from "react-router-dom";
import { ApiRequest } from "api/apiRequest";
import { ContaParticipacoes } from "./blocos/ContaParticipacoes";
import { ContaConteudos } from "./blocos/ContaConteudos";

export function Conta() {
	const { id } = useParams();
	const [dataConta, setdataConta] = useState(null);
	const loading = useLoading();

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

	if (!dataConta) return;

	return (
		<div>
			<ContaPrincipal data={dataConta} fetchData={fetchData} />
			<div className="mt-3">
				<ContaConteudos />
			</div>
			<div className="mt-3">
				<ContaParticipacoes />
			</div>
		</div>
	);
}
