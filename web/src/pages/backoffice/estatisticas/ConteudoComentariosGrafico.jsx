import { ApiRequest } from "api";
import { GraficoBarras, GraficoLinhas } from "components";
import { useLoading } from "hooks/useLoading";
import { LoadingAnimation } from "layouts/loading/LoadingAnimation";
import { useEffect, useState } from "react";

export function ConteudoComentariosGrafico() {
	const [data, setdata] = useState(null);
	const [graphData, setgraphData] = useState(null);

	useEffect(() => {
		handleFetch();
	}, []);

	useEffect(() => {
		if (data) handleFormatData();
	}, [data]);

	useEffect(() => {
		if (graphData) chartData();
	}, [graphData]);

	const handleFormatData = () => {
		const contadorComentarios = {};
		data.forEach((item) => {
			if (item?.comentario_conteudo && item.comentario_conteudo.length > 0) {
				contadorComentarios[item.id] = {
					numComentarios: item.comentario_conteudo.length,
					conteudo: item.titulo,
				};
			}
		});
		setgraphData(contadorComentarios);
	};

	const handleFetch = async () => {
		const data = await ApiRequest.listar("conteudo");
		setdata(data);
	};

	const dataNumContent = () => {
		let label = [];
		if (graphData) {
			for (let item of Object.values(graphData)) {
				label.push(item.numComentarios);
			}
		}
		return label;
	};

	const labelArea = () => {
		let label = [];
		if (graphData) {
			for (let item of Object.values(graphData)) {
				label.push(item.conteudo);
			}
		}
		return label;
	};

	const chartData = () => {
		const x = {
			labels: labelArea(),
			datasets: [
				{
					label: "Quantidade de comentarios por conteudo",
					data: dataNumContent(),
					fill: false,
					borderColor: "rgb(75, 192, 192)",
					tension: 0.1,
				},
			],
		};
		return x;
	};

	return (
		<>
			{!data || !graphData ? (
				<div className="d-flex align-items-md-center justify-content-center">
					<LoadingAnimation />
				</div>
			) : (
				<GraficoBarras chartData={chartData()} />
			)}
		</>
	);
}
