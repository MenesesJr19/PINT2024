import { Link } from "react-router-dom";
import { Texto, Imagem, PequenoPerfil, Rotulo } from "components/index";

import "./post.css";
import { COMMON_SIZES, COMMON_TYPES } from "data/data";
import { DateUtils } from "utils/date.utils";
import { Row } from "components/ui/Row";

export function Post({ id, titulo, topico, subtopico, tipo, utilizador, date, imagem }) {
	return (
		<article className="Post" id={id}>
			<Link to={`/conteudos/${id}`}>
				<div className="post-card">
					<Imagem src={imagem} className="card-img-top" style={{ height: "10rem", objectFit: "cover" }} />
					<div className="post-card-body">
						<div className="mb-2">
							<PequenoPerfil
								id={utilizador.id}
								imagem={utilizador.imagem}
								nome={utilizador.nome + " " + utilizador.sobrenome}
								data={DateUtils.DataRelativa(date)}
							/>
						</div>

						<Texto size={COMMON_SIZES.FS2} className="line-limit-text">
							{titulo}
						</Texto>
						<Row className="mt-2 gap-2">
							{tipo && <Rotulo info={tipo} backgroundColor={"gold"} textColor={COMMON_TYPES.PRIMARIO} />}
							{topico && <Rotulo info={topico} backgroundColor={"gold"} textColor={COMMON_TYPES.PRIMARIO} />}
							{subtopico && <Rotulo info={subtopico} />}
						</Row>
					</div>
				</div>
			</Link>
		</article>
	);
}
