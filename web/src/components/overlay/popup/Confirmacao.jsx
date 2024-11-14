import React from "react";
import { ModalBase } from "./ModalBase";
import { Icone, Botao } from "components/index";
import { BUTTON_VARIANTS } from "data/data";

export function Confirmacao({
	title = "Título da Confirmação",
	body = "Corpo da Confirmação",
	successLabel = "Sim",
	errorLabel = "Não",
	onSuccess,
	onError,
	onClose,
}) {
	const handleSuccessClick = () => {
		try {
			onSuccess();
		} catch (e) {
			console.error("<Confirmacao/> | onSucess() is not a function!");
		}
		onClose();
	};

	const handleErrorClick = () => {
		try {
			onError();
		} catch (e) {
			console.error("<Confirmacao/> | onError() is not a function!");
		}
		onClose();
	};

	return (
		<section>
			<ModalBase
				popupWidth={false}
				headerTitle={title}
				onClose={onClose}
				footer={
					<div className="d-flex gap-2">
						<Botao variant={BUTTON_VARIANTS.SUCESSO} onClick={handleSuccessClick}>
							<Icone iconName="CheckLg" className="icon-inverse" /> {successLabel}
						</Botao>
						<Botao variant={BUTTON_VARIANTS.PERIGO} onClick={handleErrorClick}>
							<Icone iconName="XLg" className="icon-inverse" /> {errorLabel}
						</Botao>
					</div>
				}
				className="modal-confirmacao"
			>
				{body}
			</ModalBase>
		</section>
	);
}
