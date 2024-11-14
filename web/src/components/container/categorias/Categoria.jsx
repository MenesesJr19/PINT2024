import React, { useEffect, useState } from "react";
import "./categoria.css";
import { Icone, Texto } from "components";

export function Categoria({ id, category, handleChange, value = false }) {
	const [selected, setSelected] = useState(false);

	useEffect(() => {
		setSelected(value);
	}, []);

	const toggleSelect = () => {
		setSelected(!selected);
		handleChange(!selected, id);
	};

	return (
		<div key={category} className={`card-categoria ${selected ? "selected" : ""}`} onClick={() => toggleSelect()}>
			{selected && <Icone iconName="CheckCircleFill" className="check-icon icon-size-big" />}
			<Texto>{category}</Texto>
		</div>
	);
}
