import { Line } from "react-chartjs-2";
import "chart.js/auto";

export function GraficoLinhas({ chartData, Nome }) {
	if (!chartData) {
		return <p>Carregando...</p>;
	}

	const totalData = chartData.datasets.reduce(
		(total, dataset) => total + dataset.data.reduce((sum, value) => sum + value, 0),
		0
	);

	return (
		<div className="chart-container">
			<Line
				data={chartData}
				options={{
					scales: {
						y: {
							beginAtZero: true,
							ticks: {
								precision: 0,
							},
						},
					},
					plugins: {
						title: {
							display: true,
							text: `${Nome ? Nome : ""}`,
							font: {
								weight: "bold",
							},
						},
					},
				}}
				className="w-100 h-100"
			/>
		</div>
	);
}
