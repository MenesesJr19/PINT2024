import React from "react";
import { Modal } from "react-bootstrap";
import { Icone } from "components/index";
import "./popup.css";

export function ModalBase({ headerTitle, headerInfo, headerIcons, children, footer, onClose, styles, className, id }) {
	return (
		<Modal
			id={id}
			show={true}
			onHide={onClose}
			style={styles}
			className={`modal-modalbase ${className}`}
			aria-hidden="true"
		>
			<div>
				<Modal.Body>
					<section className="modalbase-header d-flex justify-content-between">
						<div>{headerInfo}</div>
						<ModalHeaderIcons headerIcons={headerIcons} onClose={onClose} isVisible={headerInfo} />
					</section>
					<section className="modalbase-title d-flex justify-content-between">
						<Modal.Title>
							<div className="mt-2">{headerTitle}</div>
						</Modal.Title>
						<ModalHeaderIcons headerIcons={headerIcons} onClose={onClose} isVisible={!headerInfo} />
					</section>
					<section className="modalbase-body mt-2">{children}</section>
					{footer && <section className="modalbase-footer mt-5">{footer}</section>}
				</Modal.Body>
			</div>
		</Modal>
	);
};

const ModalHeaderIcons = ({ headerIcons, onClose, isVisible }) => {
	return isVisible && (
		<div className="d-flex align-items-center modal-header-icons">
			{headerIcons}
			<Icone iconName="XLg" title="Fechar" onClick={onClose} />
		</div>
	);
};

