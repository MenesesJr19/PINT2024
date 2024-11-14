import { useEffect, useState } from "react";
import { MapaComponent } from "./MapaComponent";
import { Popup } from "components";

export function MapaPopup({ handleChange, popupState, setPopupState }) {
	const [isOpen, setisOpen] = useState(false);
	const [dataCoords, setdataCoords] = useState(null);

	useEffect(() => {
		setisOpen(popupState);
	}, [popupState]);

	useEffect(() => {
		setdataCoords(dataCoords);
		handleChange(dataCoords);
	}, [dataCoords]);

	return (
		<>
			{isOpen && (
				<Popup
					headerTitle={"Selecione o endereço"}
					onClose={() => setisOpen(false)}
					body={<MapaComponent handleChange={setdataCoords} isOpen={isOpen} setisOpen={setisOpen} />}
				/>
			)}
		</>
	);
}
