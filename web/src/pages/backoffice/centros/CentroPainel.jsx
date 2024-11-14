import React, { useEffect, useState } from "react";
import { ApiRequest } from "api/apiRequest";
import { Botao, Icone, Popup } from "components";
import { COMMON_TYPES } from "data/data";
import { CriarCentroPainel } from "./CriarCentroPainel";
import { Tabela } from "components/ui/tabela/Tabela";

const columns = [{ id: "centro", label: "Centro", minWidth: 170 }];

export function CentroPainel() {
	const [dataCentro, setdataCentro] = useState(null);
	const [isPopupOpen, setisPopupOpen] = useState(false);

	useEffect(() => {
		fetchConteudoData();
	}, []);

	const fetchConteudoData = async () => {
		const data = await ApiRequest.listar("centro/simples");
		setdataCentro(data);
	};

	const handleCreated = () => {
		fetchConteudoData();
		setisPopupOpen(false);
	};

	if (!dataCentro) return;

	const rows = dataCentro.map((item) => ({
		id: item.id,
		centro: item.centro,
	}));

	return (
		<>
			{isPopupOpen && (
				<Popup
					headerTitle={"Adicionar Centro"}
					onClose={() => setisPopupOpen(false)}
					body={<CriarCentroPainel handleCreated={() => handleCreated()} />}
				/>
			)}
			<div className="d-flex align-items-center gap-3">
				<Botao onClick={() => setisPopupOpen(true)}>
					<Icone iconName="PlusLg" type={COMMON_TYPES.INVERSO} />
					Centro
				</Botao>
			</div>
			<Tabela columns={columns} rows={rows} />
		</>
	);
}
