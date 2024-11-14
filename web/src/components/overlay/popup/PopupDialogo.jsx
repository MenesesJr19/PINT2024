import React from "react";
import { ModalBase } from "./ModalBase";
import { Icone, Botao } from "components/index";
import { BUTTON_VARIANTS } from "data/data";
import { Row } from "components/ui/Row";

export function PopupDialogo({ title = "Título da Confirmação", body = "Corpo da Confirmação", footer, onClose }) {
	return (
		<section>
			<ModalBase
				popupWidth={false}
				headerTitle={title}
				onClose={onClose}
				footer={<Row className="gap-3">{footer}</Row>}
				className="modal-confirmacao"
			>
				{body}
			</ModalBase>
		</section>
	);
}
