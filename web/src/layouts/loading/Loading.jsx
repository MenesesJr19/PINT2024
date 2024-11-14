import React from "react";
import "./loading.css";
import { Imagem } from "components";
import { PROJETO_LOGO } from "data/constants";

export const Loading = () => {
	return (
		<div className="loading-container loading-operation">
			<div className="spinner">
				<div className="double-bounce1"></div>
				<div className="double-bounce2"></div>
			</div>
			<Imagem src={PROJETO_LOGO} className="loading-logo" />
		</div>
	);
};
