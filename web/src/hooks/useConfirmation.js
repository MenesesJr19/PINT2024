import { Confirmacao } from "components/index";
import { useState } from "react";

export const useConfirmation = () => {
	const [conIsOpen, setconIsOpen] = useState(false);
	const [conTitle, setconTitle] = useState("");
	const [conBody, setconBody] = useState("");
	const [conSuccessLabel, setconSuccessLabel] = useState("");
	const [conErrorLabel, setconErrorLabel] = useState("");
	const [conSuccess, setconSuccess] = useState(null);
	const [conError, setconError] = useState(null);

	const conOpen = () => {
		setconIsOpen(true);
	};

	const conClose = () => {
		setconIsOpen(false);
	};

	const conSet = ({ title, body, successLabel, errorLabel, onSuccess, onError }) => {
		setconTitle(title);
		setconBody(body);
		setconSuccessLabel(successLabel);
		setconErrorLabel(errorLabel);
		setconSuccess(() => onSuccess);
		setconError(() => onError);
	};

	const conClear = () => {
		setconTitle("");
		setconBody("");
		setconSuccessLabel("");
		setconErrorLabel("");
		setconSuccess(null);
		setconError(null);
	};

	const conCreate = () => (
		<>
			{conIsOpen && (
				<Confirmacao title={conTitle} body={conBody} successLabel={conSuccessLabel} errorLabel={conErrorLabel} onSuccess={conSuccess} onError={conError} onClose={conClose} />
			)}
		</>
	);

	return {
		conIsOpen,
		conTitle,
		conBody,
		conSuccess,
		conError,
		conSuccessLabel,
		conErrorLabel,

		setconIsOpen,
		setconTitle,
		setconBody,
		setconSuccess,
		setconError,
		setconSuccessLabel,
		setconErrorLabel,

		conSet,
		conCreate,
		conOpen,
		conClear,
		conClose,
	};
};
