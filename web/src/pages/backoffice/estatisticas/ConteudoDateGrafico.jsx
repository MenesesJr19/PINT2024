import { ApiRequest } from "api";
import { GraficoLinhas } from "components";
import { useLoading } from "hooks/useLoading";
import { LoadingAnimation } from "layouts/loading/LoadingAnimation";
import { useEffect, useState } from "react";

export function ConteudoDateGrafico() {
  const [dataConteudo, setdataConteudo] = useState(null);

  useEffect(() => {
    handleFetchArea();
  }, []);

  const handleFetchArea = async () => {
    const data = await ApiRequest.listar("conteudo");
    setdataConteudo(data);
  };

  const chartData = () => {
    if (!dataConteudo) return null;

    const conteudosPorDia = {};

    dataConteudo.forEach((conteudo) => {
      const dataPublicacao = new Date(conteudo.data_criacao);
      const dia = dataPublicacao.toISOString().split("T")[0];

      if (!conteudosPorDia[dia]) {
        conteudosPorDia[dia] = {
          date: dia,
          count: 0,
        };
      }

      conteudosPorDia[dia].count++;
    });

    const sortedDays = Object.values(conteudosPorDia).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    const labels = sortedDays.map((dia) => dia.date);
    const data = sortedDays.map((dia) => dia.count);

    return {
      labels: labels,
      datasets: [
        {
          label: "Quantidade de conteúdos por dia",
          data: data,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };
  };

  return (
    <>
      {!dataConteudo ? (
        <div className="d-flex align-items-md-center justify-content-center">
          <LoadingAnimation />
        </div>
      ) : (
        <GraficoLinhas chartData={chartData()} />
      )}
    </>
  );
}
