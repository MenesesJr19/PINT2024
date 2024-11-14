import React, { useState } from "react";

export function AreaTexto({
	label,
	prefix = false,
	inputType = "text",
	handleChange,
	value: propValue = "",
	disabled = false,
	placeholder = "",
}) {
	const [value, setValue] = useState(propValue);

	const handleInputChange = (e) => {
		setValue(e.target.value);
		if (typeof handleChange === "function") {
			handleChange(e);
		}
	};

	return (
		<div className="CaixaTexto">
			{label && <label htmlFor="inputNome">{label}</label>}
			<div className="input-group">
				{prefix && (
					<span className="input-group-text" id="basic-addon">
						{prefix}
					</span>
				)}
				<textarea
					type={inputType}
					className="form-control"
					id="inputNome"
					onChange={handleInputChange}
					value={value}
					disabled={disabled}
					placeholder={placeholder}
					style={{ resize: "none" }}
				/>
			</div>
		</div>
	);
}
