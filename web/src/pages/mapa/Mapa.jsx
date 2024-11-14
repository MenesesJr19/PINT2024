import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./mapa.css";
import { MAP_CENTER_COORDS } from "data/constants";
import { ApiRequest } from "api";
import { useLoading } from "hooks/useLoading";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Icone, Seletor, Texto } from "components";
import { Link, useParams } from "react-router-dom";
import { Utils } from "utils/utils";
import { useInput } from "hooks/useInput";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
	iconRetinaUrl: markerIcon,
	iconUrl: markerIcon,
	shadowUrl: markerShadow,
});

export const Mapa = () => {
	const [dataConteudo, setDataConteudo] = useState([]);
	const [markers, setMarkers] = useState([]);
	const formParticipando = useInput(false);
	const loading = useLoading();
	const mapRef = useRef(null);
	const { id } = useParams();

	useEffect(() => {
		if (formParticipando.value) fetchData();
		else fetchDataUnfiltered();
	}, [formParticipando.value]);

	useEffect(() => {
		if (dataConteudo && dataConteudo.length > 0) {
			const newMarkers = transformarData(dataConteudo);
			setMarkers(newMarkers);

			const highlightedMarker = newMarkers.find((marker) => marker.id === Utils.convertoStrToInt(id));
			if (highlightedMarker && mapRef.current) {
				mapRef.current.flyTo(highlightedMarker.position, 16);
			}
		}
	}, [dataConteudo, id]);

	const fetchData = async () => {
		loading.start();
		try {
			const data = await ApiRequest.listar("conteudo/participando");
			setDataConteudo(data);
		} catch (error) {
			console.error("Error fetching conteudo:", error);
		} finally {
			loading.stop();
		}
	};

	const fetchDataUnfiltered = async () => {
		loading.start();
		try {
			const data = await ApiRequest.listar("conteudo");
			setDataConteudo(data);
		} catch (error) {
			console.error("Error fetching conteudo:", error);
		} finally {
			loading.stop();
		}
	};

	const transformarData = (data) => {
		return data.map((conteudo) => {
			const isHighlighted = conteudo.id === Utils.convertoStrToInt(id);

			// Cria um ícone customizado
			const icon = L.divIcon({
				className: "custom-icon",
				html: `<div style="background-color: ${
					isHighlighted ? "red" : "cyan"
				}; width: 28px; height: 28px; border-radius: 50%; border: 2px solid ${
					isHighlighted ? "#FFFFFF" : "#FFFFFF"
				}; box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);"></div>`,
			});

			return {
				id: conteudo.id, // Add ID to the marker object
				position: [parseFloat(conteudo.latitude), parseFloat(conteudo.longitude)],
				title: (
					<>
						<Texto>
							{conteudo.endereco}
							<Link style={{ marginLeft: "10px" }} to={`/conteudos/${conteudo.id}`}>
								<Icone iconName="ArrowsAngleExpand" className="icon-hover align-self-center" />
							</Link>
						</Texto>
					</>
				),
				icon, // Adiciona o ícone ao marcador
			};
		});
	};

	return (
		<div id="mapa">
			<Seletor
				label="Participando"
				className="mt-2"
				handleChange={(e) => formParticipando.setValue(e)}
				value={formParticipando.value}
			/>
			<MapContainer
				center={MAP_CENTER_COORDS}
				zoom={13}
				style={{ height: "100vh" }}
				ref={mapRef} // Attach the map instance to the ref
			>
				<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
				{markers.map((marker, index) => (
					<Marker key={index} position={marker.position} icon={marker.icon}>
						<Popup>{marker.title}</Popup>
					</Marker>
				))}
			</MapContainer>
		</div>
	);
};
