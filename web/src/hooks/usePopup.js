import { Popup } from "components/index";
import { useEffect, useState } from "react";

export const usePopup = () => {
	const [puIsOpen, setpuIsOpen] = useState(false);
	const [puHeaderTitle, setpuHeaderTitle] = useState(null);
	const [puHeaderInfo, setpuHeaderInfo] = useState(null);
	const [puHeaderIcons, setpuHeaderIcons] = useState(null);
	const [puBody, setpuBody] = useState(null);
	const [puFooter, setpuFooter] = useState(null);

	const puOpen = () => {
		setpuIsOpen(true);
	};

	const puClose = () => {
		setpuIsOpen(false);
	};

	const puCloseAndClear = () => {
		puClose();
		puClear();
	};

	const puSet = ({ footer, body, headerTitle, headerInfo, headerIcons }) => {
		puClear();
		setpuHeaderInfo(headerInfo);
		setpuHeaderTitle(headerTitle);
		setpuHeaderIcons(headerIcons);
		setpuBody(body);
		setpuFooter(footer);
	};

	const puClear = () => {
		setpuHeaderInfo(null);
		setpuHeaderTitle(null);
		setpuHeaderIcons(null);
		setpuBody(null);
		setpuFooter(null);
	};

	const puCreate = (...propriedades) => (
		<>
			{puIsOpen && (
				<Popup
					headerInfo={puHeaderInfo}
					headerTitle={puHeaderTitle}
					headerIcons={puHeaderIcons}
					body={puBody}
					footer={puFooter}
					onClose={puClose}
				/>
			)}
		</>
	);

	return {
		puIsOpen,
		puHeaderTitle,
		puHeaderInfo,
		puHeaderIcons,
		puBody,
		puFooter,

		setpuIsOpen,
		setpuHeaderTitle,
		setpuHeaderInfo,
		setpuHeaderIcons,
		setpuBody,
		setpuFooter,

		puSet,
		puCreate,
		puOpen,
		puClear,
		puClose,
		puCloseAndClear,
	};
};
