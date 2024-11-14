import { Popup } from "components/index";
import { ImagemModal } from "components/overlay/imagemModal/ImagemModal";
import { useEffect, useState } from "react";

export const useImagemModal = () => {
	const [imIsOpen, setimIsOpen] = useState(false);
	const [imImagem, setimImagem] = useState(null);

	const imOpen = () => {
		setimIsOpen(true);
	};

	const imClose = () => {
		setimIsOpen(false);
	};

	const imCloseAndClear = () => {
		imClose();
		imClear();
	};

	const imSet = ({ imagem }) => {
		setimImagem(imagem);
	};

	const imClear = () => {
		setimImagem(null);
	};

	const imCreate = (...propriedades) => (
		<>
			{imIsOpen && (
				<ImagemModal
					imagem={imImagem}
					onClose={imClose}
				/>
			)}
		</>
	);

	return {
		imIsOpen,
		setimIsOpen,

		imSet,
		imCreate,
		imOpen,
		imClear,
		imClose,
		imCloseAndClear,
	};
};
