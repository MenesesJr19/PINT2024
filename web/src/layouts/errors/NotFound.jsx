import { Texto } from "components/index";
import { COMMON_SIZES, COMMON_TYPES } from "data/data";
import React from "react";

export function NotFound() {
	return (
		<section>
			<div className="d-flex gap-3">
				<Texto size={COMMON_SIZES.FS6} type={COMMON_TYPES.PERIGO}>
					404
				</Texto>
				<Texto size={COMMON_SIZES.FS6}>Pagina não foi encontrada</Texto>
			</div>
			<p className="lead">Está página não existe!</p>
		</section>
	);
}
