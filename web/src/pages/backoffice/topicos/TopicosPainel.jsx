import React, { useEffect, useState } from "react";
import { ApiRequest } from "api/apiRequest";
import { Botao, Icone, Popup } from "components";
import { COMMON_TYPES } from "data/data";
import { CriarTopicoPainel } from "./CriarTopicoPainel";
import { CriarSubtopicoPainel } from "./CriarSubtopicoPainel";
import { RefreshIcone } from "components/common/icone/RefreshIcone";
import { useLoading } from "hooks/useLoading";
import { Tabela } from "components/ui/tabela/Tabela";

const columns = [
	{ id: "topico", label: "Tópico", minWidth: 170 },
	{ id: "subtopico", label: "Subtópico", minWidth: 100 },
];

export function TopicosPainel() {
	const [dataTopicos, setdataTopicos] = useState(null);
	const [isPopupTopicoOpen, setisPopupTopicoOpen] = useState(false);
	const [isPopupSubtopicoOpen, setisPopupSubtopicoOpen] = useState(false);
	const loading = useLoading(false);

	useEffect(() => {
		fetchConteudoData();
	}, []);

	const fetchConteudoData = async () => {
		loading.start();
		const data = await ApiRequest.listar("topico/simples");
		setdataTopicos(data);
		loading.stop();
	};

	const handleCreated = () => {
		fetchConteudoData();
		setisPopupTopicoOpen(false);
		setisPopupSubtopicoOpen(false);
	};

	const handleRefresh = () => {
		fetchConteudoData();
	};

	if (!dataTopicos) return;

	const rows = dataTopicos.map((item) => ({
		id: item.id,
		topico: item.topico,
		subtopico: item.subtopico_topico.map((subItem) => subItem.area).join(", "),
	}));

	return (
		<>
			{isPopupTopicoOpen && (
				<Popup
					headerTitle={"Adicionar Topico"}
					onClose={() => setisPopupTopicoOpen(false)}
					body={<CriarTopicoPainel handleCreated={() => handleCreated()} />}
				/>
			)}
			{isPopupSubtopicoOpen && (
				<Popup
					headerTitle={"Adicionar Subtopico"}
					onClose={() => setisPopupSubtopicoOpen(false)}
					body={<CriarSubtopicoPainel handleCreated={() => handleCreated()} />}
				/>
			)}
			<div className="d-flex align-items-center gap-3">
				<Botao onClick={() => setisPopupTopicoOpen(true)}>
					<Icone iconName="PlusLg" type={COMMON_TYPES.INVERSO} />
					Tópico
				</Botao>
				<Botao onClick={() => setisPopupSubtopicoOpen(true)}>
					<Icone iconName="PlusLg" type={COMMON_TYPES.INVERSO} />
					Subtópico
				</Botao>
			</div>
			<div className="d-flex justify-content-end mt-4">
				<RefreshIcone handleRefresh={() => handleRefresh()} />
			</div>
			{dataTopicos ? <Tabela columns={columns} rows={rows}  /> : <p>Carregando...</p>}
		</>
	);
}
