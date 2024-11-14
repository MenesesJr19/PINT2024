import { ApiRequest } from "api";
import { Botao, CaixaTexto, Notificacao, Popup } from "components";
import { useInput } from "hooks/useInput";
import { useState } from "react";

export function DenunciaMotivoPopup({ id, utilizadorAtual, isPopupOpen, setisPopupOpen }) {
	const motivo = useInput();

	const handleDenuncia = async () => {
		await ApiRequest.criar("denuncia", { motivo: motivo.value, comentario: id, utilizador: utilizadorAtual.id });
		Notificacao("Denuncia enviada com sucesso!");
		setisPopupOpen(false);
	}

	return (
		<>
			{isPopupOpen && (
				<Popup
					headerTitle={"Motivo da denuncia"}
					onClose={() => setisPopupOpen(false)}
					body={
						<>
							<CaixaTexto
								label="Motivo"
								value={motivo.value}
								handleChange={(e) => motivo.setValue(e.target.value)}
							/>
							<Botao className="mt-3" onClick={() => handleDenuncia()}>Confirmar</Botao>
						</>
					}
				/>
			)}
		</>
	);
}
