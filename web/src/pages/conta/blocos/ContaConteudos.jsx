import { ApiRequest } from "api";
import { Contentor, Icone, Navegar, Post, Texto } from "components";
import { HorizontalScroll } from "components/container/horizontalScroll/HorizontalScroll";
import { Row } from "components/ui/Row";
import { COMMON_SIZES } from "data/data";
import { useLoading } from "hooks/useLoading";
import { LoadingContent } from "layouts/loading/LoadingContent";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function ContaConteudos() {
	const [dataConteudos, setdataConteudos] = useState(null);
	const loading = useLoading();
	const { id } = useParams();

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		loading.start();
		await fetchConteudosData();
		loading.stop();
	};

	const fetchConteudosData = async () => {
		const data = await ApiRequest.listar("conteudo", { utilizador: id });
		setdataConteudos(data);
	};

	return (
		<Contentor>
			{dataConteudos ? (
				<HorizontalScroll
					header={
						<Row className="gap-3">
							<Texto size={COMMON_SIZES.FS3}>Meus conteudos</Texto>
						</Row>
					}
				>
					{dataConteudos?.map((item) => (
						<Post
							id={item.id}
							titulo={item.titulo}
							subtopico={item.conteudo_subtopico.area}
							utilizador={item.conteudo_utilizador}
							date={item.data_criacao}
							imagem={item.imagem}
							tipo={item.conteudo_tipo.tipo}
						/>
					))}
				</HorizontalScroll>
			) : (
				<>
					<Texto size={COMMON_SIZES.FS3}>Meus conteudos</Texto>
					<LoadingContent />
				</>
			)}
		</Contentor>
	);
}
