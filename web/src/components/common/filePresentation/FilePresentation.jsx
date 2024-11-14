import { Imagem, Navegar } from "components";

export function FilePresentation({ path, displayName, icon }) {
	return (
		<div style={{ display: "flex", alignItems: "center" }}>
			<Imagem src={icon} style={{ marginRight: "8px", width: "25px" }} />
			<Navegar to={path} target="_blank" rel="noopener noreferrer">
				{displayName}
			</Navegar>
		</div>
	);
}
