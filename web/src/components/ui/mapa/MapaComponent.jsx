import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Botao, CaixaTexto, Icone } from "components";
import { Row } from "../Row";
import { BUTTON_VARIANTS, COMMON_TYPES } from "data/data";
import { MAP_CENTER_COORDS } from "data/constants";

L.Icon.Default.mergeOptions({
	iconRetinaUrl: markerIcon2x,
	iconUrl: markerIcon,
	shadowUrl: markerShadow,
});

export const MapaComponent = ({ handleChange, setisOpen }) => {
	const [position, setPosition] = useState(null);
	const [address, setAddress] = useState("");

	const useFlyTo = (position) => {
		const map = useMap();
		useEffect(() => {
			if (position) {
				map.flyTo([position.lat, position.lng], map.getZoom());
			}
		}, [position, map]);
	};

	const LocationMarker = () => {
		const map = useMap();
		useFlyTo(position);

		useMapEvents({
			click(e) {
				const newPosition = { lat: e.latlng.lat, lng: e.latlng.lng };
				setPosition(newPosition);
				map.flyTo(newPosition, map.getZoom());
			},
		});

		return position === null ? null : <Marker position={[position.lat, position.lng]} />;
	};

	const handleSearch = async (ad) => {
		if (ad) {
			try {
				const response = await axios.get("https://nominatim.openstreetmap.org/search", {
					params: {
						q: ad,
						format: "json",
						addressdetails: 1,
						limit: 1,
					},
				});
				if (response.data && response.data.length > 0) {
					const { lat, lon } = response.data[0];
					const newPosition = { lat: parseFloat(lat), lng: parseFloat(lon) };
					setPosition(newPosition);
				} else {
					alert("Endereço não encontrado!");
				}
			} catch (error) {
				console.error("Erro na busca do endereço:", error);
				alert("Ocorreu um erro ao buscar o endereço. Tente novamente.");
			}
		}
	};

	const reverseGeocode = async (lat, lon) => {
		try {
			const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
				params: {
					lat: lat,
					lon: lon,
					format: "json",
				},
			});
			return response.data;
		} catch (error) {
			console.error("Erro na geocodificação reversa:", error);
		}
	};

	const handleGetCoords = async () => {
		if (position) {
			const addressData = await reverseGeocode(position.lat, position.lng);
			handleChange({ position, address: addressData.display_name });
			setisOpen(false);
		} else {
			alert("Escolha uma localização");
		}
	};

	return (
		<div>
			<Row className="gap-2 mb-3">
				<CaixaTexto
					value={address}
					handleChange={(e) => setAddress(e.target.value)}
					placeholder="Endereço..."
					handleSubmit={() => handleSearch(address)}
				/>
				<Botao variant={BUTTON_VARIANTS.SECUNDARIO} onClick={() => handleSearch(address)}>
					<Icone iconName="Search" type={COMMON_TYPES.INVERSO} />
				</Botao>
			</Row>
			<MapContainer center={MAP_CENTER_COORDS} zoom={13} style={{ height: "65vh", width: "100%" }}>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				/>
				<LocationMarker />
			</MapContainer>
			<Botao onClick={() => handleGetCoords()} className="mt-5">Confirmar</Botao>
		</div>
	);
};
