import { Texto } from "components/index";
import { COMMON_SIZES, COMMON_TYPES } from "data/data";
import React from "react";

export function AccessDenied() {
	return (
		<section>
			<div className="d-flex gap-3">
				<Texto size={COMMON_SIZES.FS6} type={COMMON_TYPES.PERIGO}>
					404
				</Texto>
				<Texto size={COMMON_SIZES.FS6}>Permissões negadas</Texto>
			</div>
			<p className="lead">O que estas aqui a fazer mongoloide? Vai po caralho!</p>
		</section>
	);
}
