import { Pie } from "react-chartjs-2";
import "chart.js/auto";

export function GraficoPizza({ chartData, title = "", className = "" }) {
	return (
		<div className={`chart-container ${className}`}>
			{chartData ? (
				<Pie
					data={chartData}
					options={{
						plugins: {
							title: {
								display: true,
								text: title,
								font: {
									weight: "bold",
								},
							},
						},
					}}
				/>
			) : (
				<p>Carregando..</p>
			)}
		</div>
	);
}
