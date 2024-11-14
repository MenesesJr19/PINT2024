import { ImagemUtilizador } from "components/common/imagem/ImagemUtilizador";
import { Texto, Navegar, OverlayPerfil } from "components/index";
import { Tooltips } from "components/overlay/tooltip/Tooltip";
import { COMMON_SIZES, COMMON_TYPES } from "data/data";

export function PequenoPerfil({ id, imagem, nome, data }) {
	return (
		<>
			<div style={{ display: "inline-flex", alignItems: "center" }}>
				<div>
					<ImagemUtilizador src={imagem} className="card-user-picture" />
				</div>
				<div style={{ marginLeft: "8px" }}>
					<Tooltips trigger={<OverlayPerfil imagem={imagem} nome={nome} tag={data} />}>
						<Navegar to={`/conta/${id}`}>
							<Texto>{nome}</Texto>
						</Navegar>
					</Tooltips>
					<div>
						<Texto size={COMMON_SIZES.FS0} type={COMMON_TYPES.SECUNDARIO}>
							{data}
						</Texto>
					</div>
				</div>
			</div>
		</>
	);
}
