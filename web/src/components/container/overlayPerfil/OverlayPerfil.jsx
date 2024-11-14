import { Texto, Imagem } from "components/index";
import { COMMON_SIZES, COMMON_TYPES } from "data/data";

export function OverlayPerfil({ imagem, nome, tag }) {
	return (
		<>
			<div>
				<Imagem src={imagem} className="card-user-picture" />
			</div>
			<div className="col">
				<div>
					<Texto>{nome}</Texto>
				</div>
				<div>
					<Texto size={COMMON_SIZES.FS0} type={COMMON_TYPES.SECUNDARIO}>
						{tag}
					</Texto>
				</div>
			</div>
		</>
	);
}
