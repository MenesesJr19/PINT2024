import { Dropdown, Icone, PequenoPerfil } from "components/index";
import "./comentario.css";
import { DateUtils } from "utils/date.utils";

export function Comentario({ utilizador, comentario, dropdownItems }) {
	return (
		<div className="card mb-2" key={comentario.id}>
			<div className="card-body">
				<div className="d-flex justify-content-between">
					<div className="d-flex align-items-center">
						<div>
							<PequenoPerfil
								id={utilizador.id}
								imagem={utilizador.imagem}
								nome={utilizador.nome + " " + utilizador.sobrenome}
								data={`@${utilizador.tag} - ${DateUtils.DataRelativa(comentario.data_criacao)}`}
							/>
						</div>
					</div>
					<div>
						{dropdownItems && (
							<Dropdown items={dropdownItems}>
								<Icone iconName="ThreeDotsVertical" className="icon-hover" />
							</Dropdown>
						)}
					</div>
				</div>
				<p className="card-text mt-2">{comentario.comentario}</p>
			</div>
		</div>
	);
}
