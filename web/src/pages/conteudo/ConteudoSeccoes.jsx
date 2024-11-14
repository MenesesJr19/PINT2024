import { Icone, Navegar, Post, Texto } from "components";
import "./conteudo-seccoes.css";
import { COMMON_SIZES } from "data/data";
import { useEffect, useState } from "react";
import { HorizontalScroll } from "components/container/horizontalScroll/HorizontalScroll";
import { Row } from "components/ui/Row";

export function ConteudoSeccoes({ id, titulo, icon, routeTo, data }) {
	const [dataConteudo, setdataConteudo] = useState([]);

	useEffect(() => {
		setdataConteudo(data);
	}, [data]);

	return (
		<article className="mt-4">
			<HorizontalScroll
				header={
					<Row className="gap-3">
						<Row className="gap-2">
							<Icone size={COMMON_SIZES.FS5} iconName={icon} />
							<Texto size={COMMON_SIZES.FS5}>{titulo}</Texto>
						</Row>
						<Navegar to={`/conteudos/criar/${id}`}>
							<Icone size={COMMON_SIZES.FS5} iconName="PlusLg" className="icon-hover" />
						</Navegar>
					</Row>
				}
			>
				{dataConteudo?.map((item) => (
					<Post
						id={item.id}
						titulo={item.titulo}
						subtopico={item.conteudo_subtopico.area}
						topico={item.conteudo_subtopico.subtopico_topico.topico}
						utilizador={item.conteudo_utilizador}
						date={item.data_criacao}
						imagem={item.imagem}
					/>
				))}
			</HorizontalScroll>
		</article>
	);
}
