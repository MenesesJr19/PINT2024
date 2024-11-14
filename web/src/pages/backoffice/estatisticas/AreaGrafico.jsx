import { ApiRequest } from "api";
import { GraficoBarras, GraficoLinhas } from "components";
import { useLoading } from "hooks/useLoading";
import { LoadingAnimation } from "layouts/loading/LoadingAnimation";
import { useEffect, useState } from "react";

export function AreaGrafico() {
	const [dataArea, setdataArea] = useState(null);
	const [graphData, setgraphData] = useState(null);

	useEffect(() => {
		handleFetchArea();
	}, []);

	useEffect(() => {
		if (dataArea) handleFormatData();
	}, [dataArea]);

	useEffect(() => {
		if (graphData) chartData();
	}, [graphData]);

	const handleFormatData = () => {
		const contadorTopicos = {};
		dataArea.forEach((item) => {
			contadorTopicos[item.id] = {
				numConteudos: item.conteudo_subtopico ? item.conteudo_subtopico.length : 0,
				area: item.area,
			};
		});
		setgraphData(contadorTopicos);
	};

	const handleFetchArea = async () => {
		const data = await ApiRequest.listar("subtopico");
		setdataArea(data);
	};

	const dataNumContent = () => {
		let label = [];
		if (graphData) {
			for (let item of Object.values(graphData)) {
				label.push(item.numConteudos);
			}
		}
		return label;
	};

	const labelArea = () => {
		let label = [];
		if (graphData) {
			for (let item of Object.values(graphData)) {
				label.push(item.area);
			}
		}
		return label;
	};

	const chartData = () => {
		const x = {
			labels: labelArea(),
			datasets: [
				{
					label: "Quantidade de conteudos por area",
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
			{!dataArea || !graphData ? (
				<div className="d-flex align-items-md-center justify-content-center">
					<LoadingAnimation />
				</div>
			) : (
				<GraficoBarras chartData={chartData()} />
			)}
		</>
	);
}
