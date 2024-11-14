import React, { useEffect, useState } from "react";
import "./imagem-modal.css";
import { Icone, Imagem, Texto } from "components";
import { COMMON_TYPES } from "data/data";

export function ImagemModal({ imagemSelecionada, description, children }) {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === "Escape") {
				closeModal();
			}
		};

		if (isOpen) {
			window.addEventListener("keydown", handleKeyDown);
		} else {
			window.removeEventListener("keydown", handleKeyDown);
		}

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen]);

	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	return (
		<>
			<div id="myImg" onClick={openModal} className="thumbnail">
				{children}
			</div>
			{isOpen && (
				<div className="modal-overlay" onClick={closeModal}>
					<div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
						<div className="modal-navegacao">
							<Imagem src={imagemSelecionada} alt={description} className="modal-image" />
						</div>
						<Texto type={COMMON_TYPES.INVERSO} className="modal-caption">
							{description}
						</Texto>
					</div>
					<Icone iconName="XLg" type={COMMON_TYPES.INVERSO} className="close" onClick={closeModal} />
				</div>
			)}
		</>
	);
}
