import { AreaGrafico } from "./AreaGrafico";
import { ConteudoComentariosGrafico } from "./ConteudoComentariosGrafico";
import { ConteudoDateGrafico } from "./ConteudoDateGrafico";

export function Estatisticas() {
	return (
		<>
			<ConteudoComentariosGrafico />
			<AreaGrafico />
			<ConteudoDateGrafico />
		</>
	);
}
