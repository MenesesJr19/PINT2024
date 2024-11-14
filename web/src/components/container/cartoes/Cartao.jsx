import PropTypes from "prop-types";
import "./cartao.css";
import User from "assets/images/placeholders/user-default.png";
import { Texto, PequenoPerfil } from "components/index";
import { Link } from "react-router-dom";
import { COMMON_SIZES } from "data/data";

Cartao.propTypes = {
	id: PropTypes.number.isRequired,
	titulo: PropTypes.string.isRequired,
	descricao: PropTypes.node.isRequired,
	utilizador: PropTypes.string.isRequired,
	date: PropTypes.string.isRequired,
	handleClick: PropTypes.func,
	footer: PropTypes.node,
	imagem: PropTypes.string,
	route: PropTypes.string,
};

export function Cartao({
	id = 0,
	titulo = "Por definir",
	descricao = "Por definir",
	utilizador = "João Santos",
	date = "11/05/2024",
	handleClick = null,
	footer = "teste",
	imagem = User,
	route = "",
}) {
	return (
		<Link className="main-cartao" to={route} onClick={handleClick} id={id}>
			<div className="card active cartao-corpo card-body">
				<div className="d-flex">
					<PequenoPerfil id={id} imagem={imagem} nome={utilizador} data={date} />
				</div>
				<div className="cartao-corpo-titulo" title={titulo}>
					<Texto size={COMMON_SIZES.FS3} className="card-title-header">
						{titulo}
					</Texto>
				</div>
				<div className="cartao-corpo-descricao">
					<Texto className="card-body-descricao">{descricao}</Texto>
				</div>
				{footer ? <div className="remove-user-select">{footer}</div> : null}
			</div>
		</Link>
	);
}
