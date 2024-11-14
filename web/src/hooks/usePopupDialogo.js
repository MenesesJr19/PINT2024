import { PopupDialogo } from "components/overlay/popup/PopupDialogo";
import { useState } from "react";

export const usePopupDialogo = () => {
	const [conIsOpen, setconIsOpen] = useState(false);
	const [conTitle, setconTitle] = useState("");
	const [conBody, setconBody] = useState("");
	const [conFooter, setconFooter] = useState(null);

	const conOpen = () => {
		setconIsOpen(true);
	};

	const conClose = () => {
		setconIsOpen(false);
	};

	const conSet = ({ title, body, footer }) => {
		setconTitle(title);
		setconBody(body);
		setconFooter(footer);
	};

	const conClear = () => {
		setconTitle("");
		setconBody("");
		setconFooter(null);
	};

	const conCreate = () => (
		<>{conIsOpen && <PopupDialogo title={conTitle} body={conBody} footer={conFooter} onClose={conClose} />}</>
	);

	return {
		conIsOpen,
		conTitle,
		conBody,
		conFooter,

		setconIsOpen,
		setconTitle,
		setconBody,
		setconFooter,

		conSet,
		conCreate,
		conOpen,
		conClear,
		conClose,
	};
};
